import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
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

@Component({
  selector: 'component-panel',
  standalone: true,
  imports: [
    NgForOf,
    NgTemplateOutlet,
    NgIf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  dataService = inject(DataService)
  toastService = inject(ToastService)

  panel_id = ""
  panel_name = "Lädt..."

  lists: PanelList[] = []

  ngOnInit() {
    this.panel_id = this.activatedRoute.snapshot.params['identifier'];

    let req = this.dataService.requestLists(this.panel_id)
    if (typeof req !== "boolean") {
      req.subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Abfragen der Gruppen-Panels fehlgeschlagen!', bor: 3000})
          } else {
            this.lists = data.result.lists
            this.panel_name = data.result.title
            console.log(data.result)
          }
        },
        error: err => {
          this.toastService.notify({type: 'danger', text: 'Abfragen der Gruppen-Panels fehlgeschlagen!', bor: 3000})
        }
      });
    } else {
      this.toastService.notify({type: 'info', text: 'Deine Session ist Abgelaufen!', bor: 3000})
      window.location.href = "/logout"
    }
  }

  addList() {

  }

  drop(event: CdkDragDrop<PanelListItem[]>) {
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  addElementToList() {

  }
}
