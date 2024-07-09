import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'component-settings-navigation',
  standalone: true,
  imports: [],
  templateUrl: './settings-navigation.component.html',
  styleUrl: './settings-navigation.component.scss'
})
export class SettingsNavigationComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  component = ""

  ngOnInit(): void {
    this.component = this.activatedRoute.snapshot.component!.name
  }
}
