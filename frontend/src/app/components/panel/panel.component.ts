import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PanelList} from "@utils/interfaces/panel-list";

@Component({
  selector: 'component-panel',
  standalone: true,
  imports: [
    NgForOf,
    NgTemplateOutlet,
    NgIf
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
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
    {
      title: "Aufgaben",
      entries: [
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Message"
        },
        {
          type: "type1",
          message: "Messagewaeshbvzdughvtnjrsbey"
        },
      ]
    },
  ]

  ngOnInit() {
    this.panel_id = this.activatedRoute.snapshot.params['identifier'];
  }

  addElementToList() {

  }

  addList() {

  }
}
