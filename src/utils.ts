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

/** An utility function to help verify webhook payload */
export async function verifySignature() {
    return !!0
}

export function formatDate(date?: Date | string) {
    return date ? (new Date(date)).toISOString().split('T')[0] : void 0
}