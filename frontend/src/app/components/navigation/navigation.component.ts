import { Component, inject } from '@angular/core';
import {StorageService} from "@utils/services/storage.service";
import {Loginuser} from "@utils/interfaces/loginuser";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'component-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  storageService = inject(StorageService)
  user: Loginuser = this.storageService.getUser()
}
