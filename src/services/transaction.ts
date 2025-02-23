import { destr } from 'destr'

import { SquadOptions } from "../types/pos";
import { CardChargeOptions, CardChargeReturn, GetAllTransactionsOption, GetAllTransactionsReturn, InitializeDebitPayOptions, InitializeDebitPayReturn, InitializePaymentError, InitializePaymentOptions, InitializePaymentReturn, InitializePaymentSuccess, ValidatePaymentOptions, ValidatePaymentReturn, VerifyTransactionRefurn } from "../types/transaction";
import { callWithHeader, checkSquadForError, formatDate, SquadError } from "../utils";

export class SquadTransaction {
    options: SquadOptions
    constructor(options: SquadOptions) {
        this.options = options
    }

    /** This allows you to charge a card using the token generated during the initial transaction which was sent via webhook */
    async chargeCard(options: CardChargeOptions) {

        const response = await callWithHeader<CardChargeReturn>(this.options.secretKey, 'transaction/charge_card', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    /** This endpoint allows you to query all transactions and filter using multiple parameters like transaction ref, start and end dates, amount, etc
    *
    *   **N.B: The date parameters are compulsory and should be a maximum of one month gap**
    */
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
     *  After initiating the request using this endpoint you are then to call the validate endpoint to complete the transaction.\
     *  
     *  **Below is quick reference for bank codes supported**
     * 
     * | BANK                     | BANK CODE |
     * | :---                            |      ---: |
     * | Access (Diamond)                | 063 |
    *  | Access                          | 044 |
    *  | Ecobank                         | 050 |
    *  | FCMB                            | 214 |
    *  | Fidelity Bank                   | 070 |
    *  | First Bank                      | 011 |
    *  | Guaranty Trust Bank             | 058 |
    *  | Heritage Bank                   | 030 |
    *  | Keystone Bank                   | 082 |
    *  | Rubies (Highstreet) MFB         | 125 |
    *  | Stanbic Bank                    | 221 |
    *  | Sterling Bank                   | 232 |
    *  | UBA                             | 033 |
    *  | Union Bank                      | 032 |
    *  | Unity Bank                      | 215 |
    *  | VFD Bank                        | 566 |
    *  | Wema Bank                       | 035 |
    *  | Zenith Bank                     | 057 |
    *  | Globus bank                     | 00103 |
    *  | Premium Trust Bank              | 105 |
    *  | LOTUS bank                      | 303 |
    *  | Optimum Trust Bank              | 107 |
    *  | Kuda MFB                        | 50211 |
     */
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

    /** Once a payment is initiated using the Direct Bank API, the transaction must be authenticated. This is done using this endpoint to receive details from the user.\

      __For the auth_model (The return for the initiaizeDebitPay SquadTransaction class): The value could be either ValidateTOKEN or ValidateOTP.\
        If ValidateTOKEN is received, the payee is expected to input OTP from \*737\*7#, hardware token or e-token to complete the transaction.\
        If ValidateOTP is returned, then an OTP will be sent to the phone number linked to the customer account number which the payee inputs to complete the transaction.__
    */
    async validatePayment(options: ValidatePaymentOptions) {
        const response = await callWithHeader<ValidatePaymentReturn>(this.options.secretKey, 'transaction/validate-payment', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    /** This method allows you to query the status of a particular transaction using the unique transaction reference attached to the transaction. 
     *  @param reference Unique transaction reference that identifies each transaction
    */
    async verifyTransaction(reference: string) {
        const response = await callWithHeader<VerifyTransactionRefurn>(this.options.secretKey, `transaction/verify/${reference}`)

        checkSquadForError(response)

        return response
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