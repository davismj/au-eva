import {Bchg} from './bchg';
import {Jrnl} from './jrnl';

export class Tran {
  id: string;
  parentJrnl: Jrnl;
  date: string;
  intraDateSorter: number;
  totalChangesAssets: number = 0.00;
  totalChangesEquities: number = 0.00;
  bchgList: Array<Bchg> = [];

  constructor(id: string,
              parentJrnl: Jrnl,
              date: string,
              intraDateSorter: number) {
    this.id = id;
    this.parentJrnl = parentJrnl;
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
  }

  compareToInJrnl(b: Tran): number {
    return (
      this.date == b.date ?
        (this.intraDateSorter > b.intraDateSorter ? 1 : -1) :
        (this.date > b.date ? 1 : -1)
    )
  }

  calcTotalChangesToEachSide(sideIdAssets, sideIdEquities) {
    let totalChangesAssets: number = 0.00;
    let totalChangesEquities: number = 0.00;
    // compute totalChangesAssets, totalChangesEquities for indexes 1 ... n of this.bchgList
    for (let bchg of this.bchgList) {
      switch (bchg.targetAcct.parentFaeSide.id) {
        case sideIdAssets:
          totalChangesAssets += bchg.amt;
          bchg.targetAcct.refresh();
          break;
        case sideIdEquities:
          totalChangesEquities += bchg.amt;
          bchg.targetAcct.refresh();
          break;
        default:
          throw new Error(`acct.parentFaeSide.id has invalid value: ${bchg.targetAcct.parentFaeSide.id}.`);
      }
    }
  }

  computeBalancingBchgAmt(sideIdAssets, sideIdEquities) {
    let totalChangesAssets: number = 0.00;
    let totalChangesEquities: number = 0.00;
    let balancingBchg: Bchg = this.bchgList[0];
    // compute totalChangesAssets, totalChangesEquities for indexes 1 ... n of this.bchgList
    for (let bchg of this.bchgList.slice(1)) {
      switch (bchg.targetAcct.parentFaeSide.id) {
        case sideIdAssets:
          totalChangesAssets += bchg.amt;
          bchg.targetAcct.refresh();
          break;
        case sideIdEquities:
          totalChangesEquities += bchg.amt;
          bchg.targetAcct.refresh();
          break;
        default:
          throw new Error(`acct.parentFaeSide.id has invalid value: ${bchg.targetAcct.parentFaeSide.id}.`);
      }
    }
    // compute amt for balancing bchg
    switch (balancingBchg.targetAcct.parentFaeSide.id) {
      case sideIdAssets:
        balancingBchg.amt = totalChangesEquities - totalChangesAssets;
        totalChangesAssets += balancingBchg.amt;
        balancingBchg.targetAcct.refresh();
        break;
      case sideIdEquities:
        balancingBchg.amt = totalChangesAssets - totalChangesEquities;
        totalChangesEquities += balancingBchg.amt;
        balancingBchg.targetAcct.refresh();
        break;
      default:
        throw new Error(`acct.parentFaeSide.id has invalid value: ${balancingBchg.targetAcct.parentFaeSide.id}.`);
    }
    this.totalChangesAssets = totalChangesAssets;
    this.totalChangesEquities = totalChangesEquities;
  }

  regToAccts() {
  }

  unregFromAccts() {
  }

  clone()
    :
    Tran {
    let clonedTran = new Tran(
      /*id*/ this.id,
      /*parentJrnl*/ this.parentJrnl,
      /*date*/ this.date,
      /*intraDateSorter*/ this.intraDateSorter);
    clonedTran.totalChangesAssets = this.totalChangesAssets;
    clonedTran.totalChangesEquities = this.totalChangesEquities;
    for (let bchg of this.bchgList) {
      clonedTran.bchgList.push(bchg.clone());
    }
    return clonedTran;
  }
}
