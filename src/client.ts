import { SquadMerchant } from "./services/merchant";
import { SquadPos } from "./services/pos";
import { SquadTransaction } from "./services/transaction";
import { SquadOptions } from "./types/pos";

export class SquadClient {
    options: SquadOptions;
    merchant: SquadMerchant
    pos: SquadPos
    transaction: SquadTransaction
    constructor(options: SquadOptions) {
        this.options = options;
        this.merchant = new SquadMerchant(options)
        this.pos = new SquadPos(options)
        this.transaction = new SquadTransaction(options)
    }
}