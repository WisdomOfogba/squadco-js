export type InitializePaymentOptions = {
    /** Customer's email address. */
    email: string
    /** The amount you are debiting customer (expressed in the lowest currency value - kobo& cent).  10000 = 100NGN for Naira Transactions */
    amount: string
    /** The currency you want the amount to be charged in. Allowed value is either NGN or USD. */
    currency: string
    /** Name of Customer carrying out the transaction */
    customer_name?: string
    /** This states the method by which the transaction is initiated. At the moment, this can only take the value "inline". */
    initiate_type: "inline"
    /** An alphanumeric string that uniquely identifies a transaction */
    transaction_ref?: string
    /** Sample: http://squadco.com */
    callback_url?: string
    /** An array of payment channels to control what channels you want to make available for the user to make a payment with. Available channels include; **`['card', 'bank', 'ussd', 'transfer']`** */
    payment_channels?: ('card' | 'bank' | 'ussd' | 'transfer')[]
    /** Object that contains any additional information that you want to record with the transaction. The custom fields in the object will be returned via webhook and the payment verification endpoint. */
    metadata?: Record<string, unknown>
    /** It is set to False by default. When set to True, the charges on the transaction is computed and passed on to the customer(payer).
        But when set to False, the charge is passed to the merchant and will be deducted from the amount to be settled to the merchant. 
    */
    pass_charge?: boolean
    /** This is the ID of a merchant that was created by an aggregator which allows the aggregator initiate a transaction on behalf of the submerchant.\
        This parameter is an optional field that is passed only by a registered aggregator. */
    sub_merchant_id?: string
}

export type InitializePaymentReturn = InitializePaymentSuccess | InitializePaymentError

export type InitializePaymentError = {
    title: string,
    status: number, // 400
    traceId: string,
    errors: Record<string, string | string[]>
}

export type InitializePaymentSuccess = {
    status: number
}