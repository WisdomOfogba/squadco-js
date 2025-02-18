import { SquadOptions } from "../types/pos";
import { InitializePaymentError, InitializePaymentOptions, InitializePaymentReturn, InitializePaymentSuccess } from "../types/transaction";
import { callWithHeader } from "../utils";

export class SquadTransaction {
    options: SquadOptions
    constructor(options: SquadOptions) {
        this.options = options
    }

    async initializePayment(options: InitializePaymentOptions) {
        const pass_charge = options.pass_charge !== undefined
            ? (options.pass_charge ? 'True' : 'False')
            : undefined

        const response = await callWithHeader<InitializePaymentReturn>(this.options.secretKey, 'transaction/initiate', {
            method: "POST",
            body: { ...options, pass_charge },
        })
    }
}

/** Function to handle the unique return values of the **SquadTransaction.prototype.initializePayment** method */
function handleInitializeError(response: InitializePaymentReturn): InitializePaymentSuccess {
    if (response.status === 200) return response

    throw ''
}