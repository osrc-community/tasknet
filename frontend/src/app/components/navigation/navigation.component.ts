import {Component, inject, OnInit} from '@angular/core';
import {StorageService} from "@utils/services/storage.service";
import {User} from "@utils/interfaces/user";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {Group} from "@utils/interfaces/group";
import {DataService} from "@utils/services/data.service";

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
  storageService = inject(StorageService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  groups: Group[] = []
  user: User = this.storageService.getUser()

  ngOnInit() {
  }
}
