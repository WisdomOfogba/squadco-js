export type SharedSquadReturn<T> = {
    status: number,
    success: boolean,
    message: string
    data: T
}

type SharedWebHook<T> = {
    Event: string,
    TransactionRef: string,
    Body: T & {
        amount: number,
        transaction_ref: string,
        gateway_ref: string,
        transaction_status: string,
        email: string,
        /** Usually "NGN" */
        currency: string,
        merchant_amount: number,
        /** E.g Format "2022-09-06T15:28:02.477" */
        created_at: string,
        meta: Record<string, unknown>,
    }
}

type CardTransactionWebHook = SharedWebHook<{
    transaction_type: "Card",
    customer_mobile: number | null,
    merchant_id: string,
    payment_information: {
        payment_type: "card",
        pan: string,
        recurring_id: unknown,
        card_type: string,
        token_id: string
    }
}>

type BankTranferWebHook = SharedWebHook<{
    transaction_type: "Bank",
    merchant_id: string,
    is_recurring: boolean
}>

type USSDPaymentWebHook = SharedWebHook<{
    transaction_type: "Ussd",
    customer_mobile: number | null,
    meta: Record<string, unknown>,
    is_recurring: boolean
}>

type MerchantUSSDWebHook = SharedWebHook<{
    transaction_type: "MerchantUssd",
    customer_mobile: number | null,
    payment_information: {
        payment_type: "merchantussd",
        customer_ref: string
    },
    is_recurring: boolean
}>

export type PossibleWebHooks = CardTransactionWebHook | BankTranferWebHook | USSDPaymentWebHook | MerchantUSSDWebHook
