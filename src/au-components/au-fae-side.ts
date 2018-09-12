import {customElement, bindable, inject} from 'aurelia-framework';
import {App} from 'app';
import {FaeSide} from 'app-data/models//fae-side';

@customElement('au-fae-side')
@inject(App)
export class AuFaeSide {
  app = null;
  @bindable faeSide: FaeSide;
  moverDialogModal: HTMLElement;
  moverDialogContent: HTMLElement;
  moverDialogPositionElement: HTMLElement;
  rowOpsMenuModal: HTMLElement;
  rowOpsMenuContent: HTMLElement;
  rowOpsBoundingClientRect;

  /*
   * In the following two mouesenter/mouseleave handlers, the end-of-list
   * row passes a null value as listItem to signal that the call is from the
   * end-of-list row from which there is no listItem to navigation to. This method
   * uses that signal to know not to make the nav button visible--
   * that is, it is to remain hidden. The nav button is present but hidden
   * in the end-of-list row to make the horizontal alignment of the remaining columns correct.
   *
   * event.target.children[0] is the menu buttom.
   * event.target.children[1] is the nav buttom.
   */
  constructor(app) {
    this.app = app;
  }

  onRowEnter(event, listItem) {
    if (listItem) {
      event.target.children[0].children[0].style.visibility = 'visible';
      event.target.children[1].children[0].style.visibility = 'visible';
    }
    else {
      event.target.children[0].children[0].style.visibility = 'visible';
    }
    event.target.children[5].classList.toggle('aaRowHover', true);
  }

  onRowLeave(event, listItem) {
    if (listItem) {
      event.target.children[0].children[0].style.visibility = 'hidden';
      event.target.children[1].children[0].style.visibility = 'hidden';
    }
    else {
      event.target.children[0].children[0].style.visibility = 'hidden';
    }
    event.target.children[5].classList.toggle('aaRowHover', false);
  }

  onRowOpsOpen(event, listItem) {
    this.rowOpsBoundingClientRect = (event.target as Element).parentElement.getBoundingClientRect();
    this.rowOpsMenuModal.style.display = "block";
  }

  onRowOpsCancel(event) {
    if (event.target == this.rowOpsMenuModal) {
      this.rowOpsMenuModal.style.display = "none";
    }
  }

  onGoAcct(event, listItem) {
    this.app.selectedBchg = null;
    this.app.selectedAcct = listItem;
    this.app.selectedModule = this.app.MODULE_ACCT;
  }
}
