import { Eva } from '../eva';
import { Bchg } from '../models/bchg';
import { TranBchgList } from '../models/tran-bchg-list';

//
export class Tran {
  //
  eva: Eva = Eva.getInstance();
  id: string;
  date: string;
  intraDateSorter: number;
  assetsBchg: number = 0.00;
  equitiesBchg: number = 0.00;
  bchgList: TranBchgList = TranBchgList.create();

  constructor(id: string, date: string, intraDateSorter: number) {
    this.id = id;
    this.date = date;
    this.intraDateSorter = intraDateSorter;
  }

  compareTo(b: Tran): number {
    return (
      this.date == b.date ?
        (this.intraDateSorter > b.intraDateSorter ? 1 : -1) :
        (this.date > b.date ? 1 : -1)
    )
  }

  refresh() {
    this.bchgList.sort((a: Bchg, b: Bchg) => a.compareToInTran(b));
    let assetsBchg: number = 0.00;
    let equitiesBchg: number = 0.00;

    // compute assetsBchg, equitiesBchg for indexes 1 ... n of this.bchgList
    for (let bchg of this.bchgList.slice(1)) {
      switch (bchg.targetAcct.equationSide) {
        case this.eva.SIDE_ASSETS:
          assetsBchg += bchg.amt;
          break;
        case this.eva.SIDE_EQUITIES:
          equitiesBchg += bchg.amt;
          break;
        default:
          throw new Error(`acct.equationSide has invalid value: ${bchg.targetAcct.equationSide}.`);
      }
    }
    // compute bchgList[0].amt (balancing amt)
    switch (this.bchgList[0].targetAcct.equationSide) {
      case this.eva.SIDE_ASSETS:
        this.bchgList[0].amt = equitiesBchg - assetsBchg;
        assetsBchg += this.bchgList[0].amt;
        break;
      case this.eva.SIDE_EQUITIES:
        this.bchgList[0].amt = assetsBchg - equitiesBchg;
        equitiesBchg += this.bchgList[0].amt;
        break;
      default:
        throw new Error(`acct.equationSide has invalid value: ${this.bchgList[0].targetAcct.equationSide}.`);
    }
    this.bchgList[0].targetAcct.bchgList.refresh();
    this.assetsBchg = assetsBchg;
    this.equitiesBchg = equitiesBchg;

    /* for (let bchg of this.bchgList) {
      bchg.targetAcct.bchgList.refresh();
    } */
  }
}
