import {customElement} from 'aurelia-framework';
import {Eva} from '../eva';
import {Tran} from '../models/tran';
import {Bchg} from '../models/bchg';
import {TranList} from '../models/tran-list';
//
@customElement('module-tran')
export class ModuleTran {
    //
    eva:Eva = Eva.getInstance();
    tranViewSource:Tran;
    /* will point to eva.selectedTran or a copy of eva.selectedTran for editing */
    //
    bind(bindingContext:Object, overrideContext:Object) {
        // console.log('bind');
        this.tranViewSource = this.eva.selectedTran;
    }

    unbind(bindingContext:Object, overrideContext:Object) {
        // console.log('unbind');
        this.tranViewSource = null;
    }

    onGoJrnl(event) {
        this.eva.selectedBchg = null;
        this.eva.selectedModule = this.eva.MODULE_JRNL;
    }

    onGoUp(event) {
        let tranList:TranList = this.eva.tranList;
        let listIndex = tranList.findIndex(this.findIndexTest, this.eva.selectedTran.id);
        if (listIndex > 0) {
            this.eva.selectedBchg = null;
            this.eva.selectedTran = tranList[listIndex - 1];
            this.tranViewSource = this.eva.selectedTran;
        } else {
            alert('Reached beginning of list.');
        }
    }

    onGoDown(event) {
        let tranList:TranList = this.eva.tranList;
        let listIndex = tranList.findIndex(this.findIndexTest, this.eva.selectedTran.id);
        if (listIndex < tranList.length - 1) {
            this.eva.selectedBchg = null;
            this.eva.selectedTran = tranList[listIndex + 1];
            this.tranViewSource = this.eva.selectedTran;
        }
        else {
            alert('Reached end of list.');
        }
    }
    onGoBchg(event, bchg) {
        this.eva.selectedBchg = bchg;
        this.eva.selectedAcct = bchg.targetAcct;
        if (this.eva.showingModuleBchg) {
            this.eva.selectedModule = this.eva.MODULE_BCHG;
        }
        else {
            this.eva.selectedModule = this.eva.MODULE_ACCT;
        }
    }
    findIndexTest(listItem) {
        return (listItem.id == this);
    }
    onRowEnter(event, bchg) {
        if (bchg) {
            if (bchg.intraTranSorter >= 1) {
                event.target.children[0].children[0].style.visibility = 'visible';
            }
            else if(!this.eva.isEditing) {
                event.target.children[0].children[0].style.visibility = 'visible';
            }
            event.target.children[3].classList.toggle('aaRowHover', true);
        }
        if (!bchg  && this.eva.isEditing) {
            // end-of-list item
            event.target.children[0].children[0].style.visibility = 'visible';
        }
    }
    onRowLeave(event, bchg) {
        if (bchg) {
            if (bchg.intraTranSorter >= 1) {
                event.target.children[0].children[0].style.visibility = 'hidden';
            }
            else if(!this.eva.isEditing) {
                event.target.children[0].children[0].style.visibility = 'hidden';
            }
            event.target.children[3].classList.toggle('aaRowHover', false);
        }
        if (!bchg  && this.eva.isEditing) {
            // end-of-list item
            event.target.children[0].children[0].style.visibility = 'hidden';
        }
    }
    onEdit(event) {
        let copyOfTran = new Tran(
            `copy-of-${this.eva.selectedTran.id}`,
            this.eva.selectedTran.date,
            this.eva.selectedTran.intraDateSorter);
        copyOfTran.assetsBchg = this.eva.selectedTran.assetsBchg;
        copyOfTran.equitiesBchg = this.eva.selectedTran.equitiesBchg;
        let copyOfBchg:Bchg;
        for (let bchg of this.eva.selectedTran.bchgList) {
            copyOfBchg = new Bchg(
                bchg.id,
                bchg.targetAcct,
                bchg.sourceTran,
                bchg.intraTranSorter,
                bchg.desc,
                bchg.amt);
            copyOfTran.bchgList.push(copyOfBchg);
        }
        copyOfTran.refresh();
        // console.log(copyOfTran);
        // document.getElementById('tranModule-' + this.eva.selectedTran.id).classList.toggle('aaRowHover', true);
        this.tranViewSource = copyOfTran;
        this.eva.isEditing = true;
    }
    onSaveEdits(event) {
        // document.getElementById('tranModule-' + this.eva.selectedTran.id).classList.toggle('aaRowHover', false);
        this.tranViewSource = this.eva.selectedTran;
        this.eva.isEditing = false;
    }
    onCancelEdits(event) {
        document.getElementById('tranModule-' + this.eva.selectedTran.id).classList.toggle('aaRowHover', false);
        this.tranViewSource = this.eva.selectedTran;
        this.eva.isEditing = false;
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
    onArrangeRows(event) {
        alert('"Rearrange list sequence" not yet implemented.');
    }
    attached() {
        let hyperLink:Element = document.getElementById('scrollToSelected');
        if (this.eva.selectedBchg) {
            hyperLink.innerHTML = `#${this.eva.selectedBchg.id}`;
            hyperLink.setAttribute("href", `#${this.eva.selectedBchg.id}`);
            // hyperLink.click();
            document.getElementById('scrollToSelected').click();
        } else {
            hyperLink.innerHTML = "#";
        }
    }
}

