import { Component, inject } from '@angular/core';
import {StorageService} from "@utils/services/storage.service";
import {User} from "@utils/interfaces/user";
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
  user: User = this.storageService.getUser()
}
