import {Component, inject, Input, OnInit} from '@angular/core';
import {StorageService} from "@utils/services/storage.service";
import {User} from "@utils/interfaces/user";
import {ActivatedRoute, Params, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {environment} from "@env/environment";

@Component({
  selector: 'component-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  storageService = inject(StorageService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute);

  user: User = this.storageService.getUser()

  ngOnInit() {
  }
}
