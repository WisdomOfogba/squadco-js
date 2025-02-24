import { createHmac } from "node:crypto";
import { FetchOptions, ofetch } from "ofetch";

const apiUrl = process.env.NODE_ENV === 'production' ? 'https://api-d.squadco.com' : 'https://sandbox-api-d.squadco.com';

export const squadFetch = ofetch.create({
    baseURL: apiUrl,
})

export function callWithHeader<T = unknown>(privateKey: string, url: string, options?: FetchOptions<'json'>) {

    if (options) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${privateKey}`
        }
    }

    return squadFetch<T>(url, options)
}

export class SquadError extends Error {
    constructor(message: string, status: number) {
        const errorStr = `[SquadCo]: Action failed with a status of ${status} and a message "${message}"`
        super(errorStr)
    }
}

export function checkSquadForError({ status, message }: { message: string, status: number }) {
    if (status === 200) return;

    throw new SquadError(status === 401 ? 'No API key was provided' : message, status)
}


export function formatDate(date?: Date | string) {
    return date ? (new Date(date)).toISOString().split('T')[0] : void 0
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

type PossibleWebHooks = CardTransactionWebHook | BankTranferWebHook | USSDPaymentWebHook | MerchantUSSDWebHook


/** An utility function to help verify webhook payload 
 *  @param hash This is the encrypted payload which serves as a test of truth for all transactions.\ 
 * This should be compared against the body sent via the webhook by encrypting the body of data and comparing the value with this value
 * 
 * This parameter is usually the `x-squad-encrypted-body` header in the Request object 
 * @param secretKey Your SquadCo secret key
 * 
*/
export async function verifySignature({ payload, requestBody, secretKey }: { payload: string, requestBody: object, secretKey: string }) {
    const body = JSON.stringify(requestBody)
    const hash = createHmac('sha512', secretKey).update(body).digest('hex').toUpperCase();
    if (hash == payload) {
        return requestBody as PossibleWebHooks
    }
}