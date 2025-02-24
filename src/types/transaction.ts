import { SharedSquadReturn } from "./shared"

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
    /** This allows you charge a card without collecting the card information each time (Default: *false*)
     * 
     *  To tokenize a card, just add this flag to the initiate payload when calling the initiate endpoint and the card will automatically be tokenized. The unique token code will automatically be added to the webhook notification that will be received after payment.
     */
    is_recurring?: boolean
}

export type InitializePaymentReturn = InitializePaymentSuccess | InitializePaymentError

export type InitializePaymentError = {
    title: string,
    status: number, // 400
    traceId: string,
    errors: Record<string, string | string[]>
}


/** SOME FIELDS WERE LEFT TO TYPE OF UNKNOWN DUE TO UNSPECIFIED PARTS OF THE DOCUMENTATION */
export type InitializePaymentSuccess = SharedSquadReturn<{
    auth_url: string | null,
    access_token: string | null,
    merchant_info: {
        merchant_id: string
        merchant_response: string | null,
        merchant_name: string | null,
        merchant_logo: string | null,
    },
    currency: string,
    recurring: {
        frequency: unknown,
        duration: unknown,
        type: number,
        plan_code: unknown,
        customer_name: string | null
    } | null,
    is_recurring: boolean,
    plan_code: unknown,
    callback_url: string,
    transaction_ref: string,
    transaction_memo: string | null,
    transaction_amount: number,
    authorized_channels: InitializePaymentOptions['payment_channels'],
    checkout_url: string
}>

export type CardChargeOptions = {
    /** Amount to charge from card in the lowest currency value. kobo for NGN transactions or cent for USD transactions */
    amount: number
    /** A unique tokenization code for each card transaction and it is returned via the webhook for first charge on the card. */
    token_id: string
    /** Unique case-sensitive transaction reference. If you do not pass this parameter, Squad will generate a unique reference for you. */
    transaction_ref?: string
}

export type CardChargeReturn = SharedSquadReturn<{
    transaction_amount: number,
    transaction_ref: string | null,
    email: string | null,
    transaction_status: unknown,
    transaction_currency_id: unknown,
    created_at: string,
    transaction_type: unknown,
    merchant_name: string | null,
    merchant_business_name: string | null,
    gateway_transaction_ref: string | null,
    recurring: unknown,
    merchant_email: string | null,
    plan_code: unknown
}>

export type GetAllTransactionsOption = {
    /** Transacting currency */
    currency?: string
    /** Transacting amount */
    amount?: number
    /** Number of transactions to be displayed in a page */
    perPage?: number
    /** Shows which page you are on */
    page?: number
    /** Start Date of transaction */
    start_date: Date | string
    /** End Date of transaction */
    end_date: Date | string
    /** Transaction ref of a transaction
     * 
     *  You are likely to use this field if you want a particular record
     */
    reference?: string
}

export type GetAllTransactionsReturn = SharedSquadReturn<{
    id: number,
    transaction_amount: number,
    transaction_ref: string,
    email: string,
    merchant_id: string,
    merchant_amount: number,
    merchant_name: string,
    merchant_business_name: string | null,
    merchant_email: string | null,
    customer_email: string | null,
    customer_name: string | null,
    /** This is usually a JSON payload, so by default this plugin will try to convert it to an object, and if that fails, then defaults to initial value */
    meta_data: unknown
    transaction_status: string,
    transaction_charges: number,
    /** E.g "NGN" */
    transaction_currency_id: string,
    transaction_gateway_id: string | null,
    transaction_type: unknown,
    flat_charge: number,
    is_suspicious: boolean,
    is_refund: boolean,
    /** 2024-02-21T13:16:43.012+00:00 */
    created_at: string
}>

export type InitializeDebitPayOptions = {
    transaction_reference: string,
    /** The amount in kobo you are debiting customer (expressed in the lowest currency value - kobo).\
     *  E.g 10000 = 100NGN  */
    amount: number
    /** The currency you want the amount to be charged in. Allowed value is NGN */
    currency?: "NGN"

    bank: {
        /** Unique NIP code that identifies a bank. */
        bank_code: string,
        /** The GTBank account number to be debitted */
        account_or_phoneno: string
    }

    // /** Unique NIP code that identifies a bank. */
    // bank_code: string

    // /** The GTBank account number to be debitted */
    // account_or_phoneno: string

    /** Method of payment **(should use "bank")** */
    payment_method: "bank"

    /** Allows you define where webhook notification is sent\
     * ___(Where none is presented, the default webhook for merchant is notified)___ */
    webhook_url?: string

    /** It is set to False by default. When set to True, the charges on the transaction is computed and passed on to the customer(payer).\
        But when set to False, the charge is passed to the merchant and will be deducted from the amount to be settled to the merchant. */
    pass_charge: boolean

    customer: {
        name: string,
        email: string
    }
}

export type InitializeDebitPayReturn = SharedSquadReturn<{
    amount: number,
    message: string,
    transaction_ref: string,
    transaction_type: string,
    gateway_ref: string,
    merchant_amount: number,
    auth_model: string
}>

export type ValidatePaymentOptions = {
    /** Transaction Refrence from the initiated payment */
    transaction_reference: string
    authorizaion: {
        /** Unique OTP or Token sent to customer, required for transaction completion */
        otp_token: string
    }
}

export type ValidatePaymentReturn = SharedSquadReturn<{
    amount: 56800,
    message: string
    transaction_ref: string,
    transaction_type: string,
    gateway_ref: string,
    merchant_amount: number,
    auth_model: "ValidateTOKEN" | "ValidateOTP",
}>

export type VerifyTransactionRefurn = SharedSquadReturn<{
    transaction_amount: number,
    transaction_ref: string,
    email: string,
    transaction_status: "Success" | "failed",
    /** Usually "NGN" */
    transaction_currency_id: string,
    /** E.g "2004-01-21T04:30:20" */
    created_at: string,
    transaction_type: string,
    merchant_name: string,
    merchant_business_name: string | null,
    gateway_transaction_ref: string,
    recurring: unknown,
    merchant_email: string,
    plan_code: unknown
}>

export type RefundOptions = {
    /** Unique reference that uniquely identifies the medium of payment and can be obtained from  the webhook notification sent to you. */
    gateway_transaction_ref: string
    /** Unique reference that identifies a transaction.\
        Can be obtained from the dashboard or the webhook notification sent to you */
    transaction_ref: string
    /** The value of this parameter is either "Full" or "Partial" */
    refund_type: "Full" | "Partial"
    reason_for_refund: string
    /** Refund amount is in kobo or cent.
     * 
     * __This is only required for "Partial" refunds__ */
    refund_amount?: string
}


export type RefundReturn = SharedSquadReturn<{
    gateway_refund_status: string,
    refund_status: number,
    refund_reference: string
}>