import { SharedSquadReturn } from "./shared"

type POSTransactionsRow = {
    id: string,
    amount: string,
    status: number,
    card: string,
    createdAt: string,
    updatedAt: string,
    merchant_id: string,
    terminal_id: string,
    location_id: string
}

type GetTerminalsRow = {
    id: string,
    merchant_id: string,
    name: string,
    email: string,
    phone: string,
    registered: boolean,
    enabled: boolean,
    active: boolean,
    createdAt: string,
    updatedAt: string,
    location_id: string,
    location: {
        id: string,
        /** E.g Abuja */
        name: string,
        createdAt: string,
        updatedAt: string,
    }
}


export type SquadOptions = {
    secretKey: string,
    publicKey: string
}

export type POSTransactionOptions = {
    /** Number of transactions per page */
    perPage: number
    /** Page number */
    page: number
    /** Format - YYYY-MM-DD */
    date_from?: Date | string
    /** Format - YYYY-MM-DD */
    date_to?: Date | string
    sort_by?: "createdAt" | "updatedAt"
    sort_by_dir?: "ASC" | "DESC"
}

export type POSTransactionReturn = SharedSquadReturn<{
    count: number
    rows: POSTransactionsRow[]
}>


export type CreateTerminalOptions = {
    /** Unique email to be associated to the terminal being created */
    email: string
    /** Name to be associated to the terminal */
    name: string
    /** 11 digit phone number to be associated to the terminal */
    phone: string
    /** Unique ID that identifies a particular location */
    locationId: number
}

export type CreateTerminalReturn = SharedSquadReturn<{
    enabled: boolean,
    id: string,
    name: string,
    phone: string,
    email: string,
    location_id: string,
    updatedAt: string,
    createdAt: string,
    merchant_id: string | null
}>


export type GetTerminalsOptions = POSTransactionOptions & {
    location_id: number
    active: boolean
}

export type GetTerminalsReturn = SharedSquadReturn<{
    count: number
    rows: GetTerminalsRow[]
}>