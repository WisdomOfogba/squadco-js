import { CreateTerminalOptions, CreateTerminalReturn, GetTerminalsOptions, GetTerminalsReturn, POSTransactionOptions, POSTransactionReturn, SquadOptions } from "../types/services/pos";
import { callWithHeader, checkSquadForError, formatDate } from "../utils";

export class SquadPos {
    options: SquadOptions
    constructor(options: SquadOptions) {
        this.options = options
    }

    async createTerminal(options: CreateTerminalOptions) {

        const response = await callWithHeader<CreateTerminalReturn>(this.options.secretKey, 'softpos/terminal', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    async getAllTerminals(options: GetTerminalsOptions) {
        options.date_from = formatDate(options.date_from)
        options.date_to = formatDate(options.date_to)

        const response = await callWithHeader<GetTerminalsReturn>(this.options.secretKey, 'softpos/terminals', {
            // query: { ...options, active: options.active ? "True" : "False" }
            query: options
        })

        checkSquadForError(response)

        return response
    }

    async getAllTransactions(options: POSTransactionOptions) {
        options.date_from = formatDate(options.date_from)
        options.date_to = formatDate(options.date_to)

        const response = await callWithHeader<POSTransactionReturn>(this.options.secretKey, 'softpos/transactions', {
            query: options
        })

        checkSquadForError(response)

        return response
    }
}
