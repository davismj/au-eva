import {customElement} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {App} from "app";

@customElement('au-module-tran')
@inject(App)
export class AuModuleTran {
  app = null;
  moverDialogModal: HTMLElement;
  moverDialogContent: HTMLElement;
  moverDialogPositionElement: HTMLElement;

  constructor(app) {
    this.app = app;
  }

  onGoJrnl(event) {
    this.app.selectedBchg = null;
    this.app.selectedModule = this.app.MODULE_JRNL;
  }

  onGoUp(event) {
    let selectedTranId = this.app.selectedTran.id;
    let tranList = this.app.selectedTran.parentJrnl.tranList;
    let listIndex = tranList.findIndex(function (tran) {
      return tran.id === selectedTranId;
    });
    console.log(`listIndex = ${listIndex}`);
    if (listIndex > 0) {
      this.app.selectedBchg = null;
      this.app.selectedTran = tranList[listIndex - 1];
    } else {
      alert('Reached beginning of list.');
    }
  }

  onGoDown(event) {
    let selectedTranId = this.app.selectedTran.id;
    let tranList = this.app.selectedTran.parentJrnl.tranList;
    let listIndex = tranList.findIndex(function (tran) {
      return tran.id === selectedTranId;
    });
    console.log(`listIndex = ${listIndex}`);
    if (listIndex < tranList.length - 1) {
      this.app.selectedBchg = null;
      this.app.selectedTran = tranList[listIndex + 1];
    }
    else {
      alert('Reached end of list.');
    }
  }

  showBchgDetail(event, bchg) {
    this.app.selectedBchg = bchg;
    this.app.selectedAcct = bchg.targetAcct;
    this.app.selectedModule = this.app.MODULE_BCHG;
  }

  showBchgInAcct(event, bchg) {
    this.app.selectedBchg = bchg;
    this.app.selectedAcct = bchg.targetAcct;
    this.app.selectedModule = this.app.MODULE_ACCT;
  }

  onRowEnter(event, bchg) {
    if (bchg) {
      if (bchg.intraTranSorter >= 1) {
        event.target.children[0].children[0].style.visibility = 'visible';
        event.target.children[0].children[1].style.visibility = 'visible';
      }
      else if (!this.app.isEditing) {
        event.target.children[0].children[0].style.visibility = 'visible';
      }
    }
    event.target.children[1].classList.toggle('aaRowHover', true);
    /*
        if (!bchg && this.app.isEditing) {
          // end-of-list item
          event.target.children[0].children[0].style.visibility = 'visible';
        }
    */
  }

  onRowLeave(event, bchg) {
    if (bchg) {
      if (bchg.intraTranSorter >= 1) {
        event.target.children[0].children[0].style.visibility = 'hidden';
        event.target.children[0].children[1].style.visibility = 'hidden';
        event.target.children[1].classList.toggle('aaRowHover', false);
      }
    }
    else {
      event.target.children[0].children[0].style.visibility = 'hidden';
    }
    event.target.children[4].classList.toggle('aaRowHover', false);
  }

  onEdit(event) {
    this.app.isEditing = true;
  }

  onSaveEdits(event) {
    this.app.selectedTran.computeBalancingBchgAmt(this.app.data.SIDE_ID_ASSETS, this.app.data.SIDE_ID_EQUITIES);
    this.app.selectedTran.refresh();
    this.app.isEditing = false;
  }

  onCancelEdits(event) {
    document.getElementById('tranModule-' + this.app.selectedTran.id).classList.toggle('aaRowHover', false);
    this.app.isEditing = false;
  }

  onDelete(event) {
    alert('"Delete transaction" not yet implemented.');
  }

  onPickAcct(event, bchg) {
    alert(`bchg.id: ${bchg.id} - "Acct picker dialog" not yet implemented.`);
  }

  onMenuClick(event, bchg) {
    alert(`bchg.id: ${bchg ? bchg.id : "End-of-list"} - "Row ops menu" not yet implemented.`);
  }

  onMoverDialogOpen(event) {
    alert('"Rearrange list sequence" not yet implemented.');
  }

  attached() {
    let hyperLink: Element = document.getElementById('scrollToSelected');
    if (this.app.selectedBchg) {
      hyperLink.innerHTML = `#${this.app.selectedBchg.id}`;
      hyperLink.setAttribute("href", `#${this.app.selectedBchg.id}`);
      // hyperLink.click();
      document.getElementById('scrollToSelected').click();
    } else {
      hyperLink.innerHTML = "#";
    }
  }
}

