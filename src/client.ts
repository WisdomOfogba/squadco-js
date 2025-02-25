import { SquadMerchant } from "./services/merchant";
import { SquadPayout } from "./services/payout";
import { SquadPos } from "./services/pos";
import { SquadTransaction } from "./services/transaction";
import { SquadOptions } from "./types/services/pos";

export class SquadClient {
    options: SquadOptions;
    merchant: SquadMerchant
    pos: SquadPos
    payout: SquadPayout
    transaction: SquadTransaction
    constructor(options: SquadOptions) {
        this.options = options;
        this.merchant = new SquadMerchant(options)
        this.pos = new SquadPos(options)
        this.payout = new SquadPayout(options)
        this.transaction = new SquadTransaction(options)
    }
}