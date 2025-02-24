import { SharedSquadReturn } from ".."

export type AccountLookupOptions = {
    /** Unique NIP code that identifies a bank. */
    bank_code: string
    /** Account number you want to transfer to */
    account_number: string
}

export type AccountLookupReturn = SharedSquadReturn<{
    account_name: string,
    account_number: string
}>

export type PayoutTransferOptions = {
    /** Unique Transaction Reference used to initiate a transfer.\
         Please ensure that you append your merchant ID to the transaction Reference you are creating. This is compulsory as it will throw an error if you don't append it. 
    */
    transaction_reference: string
    /** Amount to be transferred.\
     *  __Value is in Kobo.__ */
    amount: string
    /** Unique NIP Code that identifies a bank.  */
    bank_code: string
    /** 10-digit NUBAN account number to be transferred to. Must be an account that has been looked up and vetted to be transferred to. */
    account_number: string
    /** The account name tied to the account number you are transferring to which you have looked up using our look up API. */
    account_name: string
    currency_id: "NGN"
    /** A unique remark that will be sent with the transfer. */
    remark: string
}

export type PayoutTransferReturn = SharedSquadReturn<{
    transaction_reference: string,
    response_description: string,
    currency_id: "NGN",
    amount: string,
    nip_transaction_reference: string,
    account_number: string,
    account_name: string,
    destination_institution_name: string
}>

export type RequeryReturn = SharedSquadReturn<{
    transaction_reference: string,
    response_description: string,
    currency_id: "NGN",
    amount: string,
    nip_transaction_reference: string,
    account_number: string,
    account_name: string,
    destination_institution_name: string
}>