import { createHmac } from "node:crypto";
import { FetchOptions, ofetch } from "ofetch";
import { PossibleWebHooks } from "./types";

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