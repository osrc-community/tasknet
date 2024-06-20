import {Component, inject, OnInit} from '@angular/core';
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

  panel: Panel = {image: "", title: "Lädt..."};

  lists: PanelList[] = []
  showNameModal: boolean = false;
  modal_output_name: string = "Unbenannt";
  modal_function = ""
  item_index: number = -1
  list_index: number = -1

  ngOnInit() {
    this.panel.identifier = this.activatedRoute.snapshot.params['identifier'];
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

  syncPanel() {
    let panel: Panel = this.panel
    panel.lists = this.lists
    this.dataService.panel_update(panel).subscribe({
      next: data => {
        if (data.success == 0) {
          this.toastService.notify({type: 'danger', text: 'Updaten des Panels fehlgeschlagen!', bor: 3000})
        }
      }
    });
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
  toggleNameModal() {
    this.showNameModal = !this.showNameModal
  }

  addElementToList(list_index: number) {
    this.lists[list_index].entries.push({type: "-", message: "Neuer Eintrag"})
  }

  renameElement(item_index: number, list_index: number) {
    this.item_index = item_index
    this.list_index = list_index
    this.modal_function = "rename_element"
    this.toggleNameModal()
  }

  modalFunction() {
    if (this.modal_function == 'create_list') {
      this.lists.push({title: this.modal_output_name, entries: []})
    } else if (this.modal_function == 'rename_element') {
      this.lists[this.list_index].entries[this.item_index] = {type: "-", message: this.modal_output_name}
    }
    this.toggleNameModal()
  }

  addList() {
    this.modal_function = "create_list"
    this.toggleNameModal()
  }
}
