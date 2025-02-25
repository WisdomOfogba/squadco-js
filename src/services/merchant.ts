import { SquadOptions } from "../types/services/pos";
import { CreateSubMerchantOptions, CreateSubMerchantReturn } from "../types/services/merchant";
import { callWithHeader, checkSquadForError } from "../utils";

export class SquadMerchant {
  options: SquadOptions;
  constructor(options: SquadOptions) {
    this.options = options;
  }

  async createSubMerchant(options: CreateSubMerchantOptions) {
    // create sub merchant logic
        const response = await callWithHeader<CreateSubMerchantReturn>(this.options.secretKey, 'merchant/create-sub-users', {
            method: "POST",
            body: options,
        })

        checkSquadForError(response)

        return response
  }
}