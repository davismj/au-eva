import {customElement, inject} from 'aurelia-framework';
import {App} from 'app';

@customElement('au-module-acct')
@inject(App)
export class AuModuleAcct {
  app = null;

  constructor(app) {
    this.app = app;
  }

  onGoFae(event) {
    this.app.selectedBchg = null;
    this.app.selectedModule = this.app.MODULE_FAE;
  }

  onGoUp(event) {
    let selectedAcctId = this.app.selectedAcct.id;
    let acctList = this.app.selectedAcct.parentFaeSide.acctList;
    let listIndex = acctList.findIndex(function (acct) {
      return acct.id === selectedAcctId
    });
    if (listIndex > 0) {
      this.app.selectedBchg = null;
      this.app.selectedAcct = acctList[listIndex - 1];
    } else {
      alert('Reached beginning of list.');
    }
  }

  onGoDown(event) {
    let selectedAcctId = this.app.selectedAcct.id;
    let acctList = this.app.selectedAcct.parentFaeSide.acctList;
    let listIndex = acctList.findIndex(function (acct) {
      return acct.id === selectedAcctId
    });
    if (listIndex < acctList.length - 1) {
      this.app.selectedBchg = null;
      this.app.selectedAcct = acctList[listIndex + 1];
    }
    else {
      alert('Reached end of list.');
    }
  }

  // getAcctIndex(listItem) {
  //   return (listItem.id == this.app.selectedAcct.id); //returns index, not boolean
  // }
  // onGoUp(event) {
  //   let selectedAcctIndex = this.app.selectedAcct.parentFaeSide.acctList.findIndex(this.getAcctIndex);
  //   if (selectedAcctIndex > 0) {
  //     this.app.selectedAcct = this.app.selectedAcct.parentFaeSide.acctList[selectedAcctIndex - 1];
  //     this.app.selectedBchg = null;
  //   } else {
  //     alert('Reached beginning of list.');
  //   }
  // }
  // onGoDown(event) {
  //   let selectedAcctIndex = this.app.selectedAcct.parentFaeSide.acctList.findIndex(this.getAcctIndex);
  //   if (selectedAcctIndex  < this.app.selectedAcct.parentFaeSide.acctList.length - 1) {
  //     this.app.selectedAcct = this.app.selectedAcct.parentFaeSide.acctList[selectedAcctIndex + 1];
  //     this.app.selectedBchg = null;
  //   } else {
  //     alert('Reached end of list.');
  //   }
  // }
  showBchgDetail(event, bchg) {
    this.app.selectedTran = bchg.sourceTran;
    this.app.selectedBchg = bchg;
    this.app.selectedModule = this.app.MODULE_BCHG;
  }

  showBchgInTran(event, bchg) {
    this.app.selectedTran = bchg.sourceTran;
    this.app.selectedBchg = bchg;
    this.app.selectedModule = this.app.MODULE_TRAN;
  }

  onRowEnter(event, listItem) {
    event.target.children[0].children[0].classList.toggle('aaRowOpsHover', true);
    event.target.children[2].classList.toggle('aaRowDataHover', true);
  }

  onRowLeave(event, listItem) {
    event.target.children[0].children[0].classList.toggle('aaRowOpsHover', false);
    event.target.children[2].classList.toggle('aaRowDataHover', false);
  }

  onEdit(event) {
    if (this.app.selectedAcct.isAcct()) {
      document.getElementById('acctModule-' + this.app.selectedAcct.id).classList.toggle('aaRowDataHover', true);
    }
    this.app.isEditing = true;
  }

  onSaveEdits(event) {
    if (this.app.selectedAcct.isAcct()) {
      document.getElementById('acctModule-' + this.app.selectedAcct.id).classList.toggle('aaRowDataHover', false);
    }
    this.app.isEditing = false;
  }

  onCancelEdits(event) {
    if (this.app.selectedAcct.isAcct()) {
      document.getElementById('acctModule-' + this.app.selectedAcct.id).classList.toggle('aaRowDataHover', false);
    }
    this.app.isEditing = false;
  }

  onDelete(event) {
    alert('"Delete account" not yet implemented.');
  }

  onMenuClick(event, selectedAcct) {
    // alert(`selectedAcct.title = ${selectedAcct.title}`);
  }

  onNewTran(event, selectedAcct) {
    alert('"New tran..." not yet implemented.');
  }

  attach() {
    if (this.app.selectedBchg) {
      this.app.gridScrollerLink.setAttribute("href", `#${this.app.selectedBchg.id}`);
      // this.app.gridScrollerLink.click();
    } else {
      this.app.gridScrollerLink.setAttribute("href", `#`);
    }
  }
}

