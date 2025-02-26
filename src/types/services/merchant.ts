import { SharedSquadReturn } from ".."

export type CreateSubMerchantOptions = {
    display_name: string // name of the sub merchant
    account_name: string // sub merchant bank account name
    account_number: string 
    bank_code: string // e.g 058 for GTBank
    bank: string // e.g GTBank
}

export type CreateSubMerchantReturn = SharedSquadReturn<{
    account_id: string
}>