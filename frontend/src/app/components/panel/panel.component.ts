import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {JsonPipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PanelList} from "@utils/interfaces/panel-list";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {PanelListItem} from "@utils/interfaces/panel-list-item";
import {DataService} from "@utils/services/data.service";
import {ToastService} from "@utils/services/toast.service";
import {FormsModule} from "@angular/forms";
import {Panel} from "@utils/interfaces/panel";
import {ModalService} from "@utils/services/modal.service";
import {parseJson} from "@angular/cli/src/utilities/json-file";

@Component({
  selector: 'component-panel',
  standalone: true,
  imports: [
    NgForOf,
    NgTemplateOutlet,
    NgIf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    JsonPipe,
    FormsModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  dataService = inject(DataService)
  toastService = inject(ToastService)
  modalService = inject(ModalService)

  panel: Panel = {image: "", title: "Lädt..."};

  lists: PanelList[] = []
  item_index: number = -1
  list_index: number = -1

  ngOnInit() {
    this.panel.identifier = this.activatedRoute.snapshot.params['identifier'];
    this.sync()
  }

  sync() {
    if (this.panel.identifier != null) {
      this.dataService.requestLists(this.panel.identifier).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Abfragen der Gruppen-Panels fehlgeschlagen!', bor: 3000})
          } else {
            this.lists = data.result.lists
            this.panel = data.result
          }
        }
      });
    }
  }

  drop(event: CdkDragDrop<PanelListItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  openListNamingModal(template: TemplateRef<any>) {
    this.modalService.open(template, 'Liste Benennen', 'max-w-md', this.listNamingConfirm.bind(this), {});
  }
  listNamingConfirm(event: any) {
    let name: string = event.srcElement[0].value
    if (name != '' && this.panel.identifier) {
      let new_list: PanelList = {title: name, entries: []}
      this.lists.push(new_list)
      this.dataService.list_create(new_list, this.panel.identifier).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Erstellen der Liste Fehlgeschlagen!', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Liste erstellt!', bor: 3000})
            this.sync()
          }
        }
      });
    } else {
      this.toastService.notify({type: "info", text: "Du musst einen Namen angeben!", bor: 3000})
    }
  }

  openElementNamingModal(template: TemplateRef<any>, item_index: number, list_index: number) {
    this.item_index = item_index
    this.list_index = list_index
    this.modalService.open(template, 'Liste Benennen', 'max-w-md', this.elementNamingConfirm.bind(this), {});
  }
  elementNamingConfirm(event: any) {
    let name: string = event.srcElement[0].value
    if (name != '') {
      let element = this.lists[this.list_index].entries[this.item_index]
      let update_entry = {type: "-", message: name, identifier: element.identifier}
      this.lists[this.list_index].entries[this.item_index] = update_entry

      this.dataService.entry_update(update_entry).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Updaten des Eintrags Fehlgeschlagen!', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Eintrag geupdatet!', bor: 3000})
            this.sync()
          }
        }
      });
    } else {
      this.toastService.notify({type: "info", text: "Du musst einen Namen angeben!", bor: 3000})
    }
  }

  addElementToList(list_index: number) {
    let new_element: PanelListItem = {type: "-", message: "Neuer Eintrag"}
    this.lists[list_index].entries.push(new_element)
    let list_identifier = this.lists[list_index].identifier

    if (list_identifier) {
      this.dataService.entry_create(new_element, list_identifier).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Erstellen des Eintrags Fehlgeschlagen!', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Eintrag erstellt!', bor: 3000})
            this.sync()
          }
        }
      });
    }
  }

  deleteElement(element: PanelListItem, item_index: number, list_index: number) {
    if (element.identifier) {
      this.dataService.entry_delete(element.identifier).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Fehler während des Löschens!', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Eintrag gelöscht!', bor: 3000})
            this.sync()
          }
        }
      });
    } else {
      this.lists[list_index].entries.splice(item_index, 1)
    }
  }
}
