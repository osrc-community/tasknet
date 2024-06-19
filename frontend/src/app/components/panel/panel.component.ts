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
import {List} from "postcss/lib/list";
import {PanelListItem} from "@utils/interfaces/panel-list-item";

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

  panel_id = ""
  panel_name = "Kicker"

  lists: PanelList[] = [
    {
      title: "Liste 1",
      entries: [
        {
          type: "type1",
          message: "Message1"
        },
        {
          type: "type1",
          message: "Message2"
        },
        {
          type: "type1",
          message: "Message3"
        },
        {
          type: "type1",
          message: "Message4"
        },
        {
          type: "type1",
          message: "Message5"
        },
        {
          type: "type1",
          message: "Message6"
        },
        {
          type: "type1",
          message: "Message7"
        },
        {
          type: "type1",
          message: "Message8"
        },
        {
          type: "type1",
          message: "Message9"
        },
        {
          type: "type1",
          message: "Message10"
        },
        {
          type: "type1",
          message: "Message11"
        },
        {
          type: "type1",
          message: "Message12"
        },
        {
          type: "type1",
          message: "Message13"
        },
      ]
    },
    {
      title: "Liste 2",
      entries: [
        {
          type: "type1",
          message: "Message2_1"
        },
        {
          type: "type1",
          message: "Message2_2"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey2_3"
        },
      ]
    },
  ]

  ngOnInit() {
    this.panel_id = this.activatedRoute.snapshot.params['identifier'];
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
