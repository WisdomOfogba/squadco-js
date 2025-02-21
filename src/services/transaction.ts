import { destr } from 'destr'

import { SquadOptions } from "../types/pos";
import { CardChargeOptions, CardChargeReturn, GetAllTransactionsOption, GetAllTransactionsReturn, InitializeDebitPayOptions, InitializeDebitPayReturn, InitializePaymentError, InitializePaymentOptions, InitializePaymentReturn, InitializePaymentSuccess } from "../types/transaction";
import { callWithHeader, checkSquadForError, formatDate, SquadError } from "../utils";

export class SquadTransaction {
    options: SquadOptions
    constructor(options: SquadOptions) {
        this.options = options
    }

    async chargeCard(options: CardChargeOptions) {

        const response = await callWithHeader<CardChargeReturn>(this.options.secretKey, 'transaction/charge_card', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    async getAllTransactions(options: GetAllTransactionsOption) {
        options.start_date = formatDate(options.start_date)!
        options.end_date = formatDate(options.end_date)!

        const response = await callWithHeader<GetAllTransactionsReturn>(this.options.secretKey, 'transaction', {
            query: options
        })

        checkSquadForError(response)

        response.data.meta_data = destr(response.data.meta_data)

        return response

    }

    /** This endpoint allows you to initiate the direct debit of a GTBank account by passing the account number.\
     *  After initiating the request using this endpoint you are then to call the validate endpoint to complete the transaction. */
    async initializeDebitPay(options: InitializeDebitPayOptions) {
        const response = await callWithHeader<InitializeDebitPayReturn>(this.options.secretKey, 'transaction/initiate/process-payment', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    async initializePayment(options: InitializePaymentOptions) {
        // const pass_charge = options.pass_charge !== undefined
        //     ? (options.pass_charge ? 'True' : 'False')
        //     : undefined

        const response = await callWithHeader<InitializePaymentReturn>(this.options.secretKey, 'transaction/initiate', {
            method: "POST",
            body: options,
        })


        const result = handleInitializeError(response)

        return result
    }
}

/** Function to handle the unique return values of the **SquadTransaction.prototype.initializePayment** method */
function handleInitializeError(response: InitializePaymentReturn) {
    if (response.status === 200) return response as InitializePaymentSuccess

    if (response.status === 401) {
        throw new SquadError('No API key was provided', response.status)
    }

    const { title, errors, status, traceId } = response as InitializePaymentError;
    const errorStr = `\n${title}\ntraceId: ${traceId}\nErrors: ${JSON.stringify(errors)}`

    throw new SquadError(errorStr, status)
}