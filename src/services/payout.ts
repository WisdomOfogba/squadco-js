import { AccountLookupOptions, AccountLookupReturn, PayoutTransferOptions } from "../types/services/payout";
import { SquadOptions } from "../types/services/pos";
import { callWithHeader, checkSquadForError } from "../utils";

export class SquadPayout {
    options: SquadOptions;
    constructor(options: SquadOptions) {
        this.options = options
    }

    /** This method allows you lookup/confirm the account name of the recipient you intend to credit.\
     *  __This should be done before initiating the transfer.__ 
     * 
     * Read more: https://squadinc.gitbook.io/squad-api-documentation/transfer-api#account-lookup
    */
    async accountLookup(options: AccountLookupOptions) {
        const response = await callWithHeader<AccountLookupReturn>(this.options.secretKey, 'payout/account/lookup', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }

    /** 
     * This method allows you to transfer funds from your Squad Wallet to the account you have looked up.
       Please be informed that we will not be held liable for mistake in transferring to a wrong account or an account that wasn't looked up.

       ### Transaction Reference
       Transaction Reference used to initiate a transfer must be unique per transfer. Kindly ensure that you append your merchant ID to the transaction Reference you are creating. This is compulsory as it will throw an error if you don't append it.

       For instance:\
       If my Squad Merchant ID is SBABCKDY and i want to create a transaction ref for my transfer, then I will have something like:

       __"transaction_reference":"SBABCKDY_12345"__

       ### ERROR CODES
       These are the various error codes that you might get on the transfer API and the one you should re-query

       200 -- Success\
       400 --- Bad request\
       422 --- Unprocessed\
       424 --- Timeout/failed --- __(Should re-query)__\
       404 --- Not found\
       412 ---- reversed
     */
    async transfer(options: PayoutTransferOptions) {
        const response = await callWithHeader<AccountLookupReturn>(this.options.secretKey, 'payout/transfer', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
    }
}