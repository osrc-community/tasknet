import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {Group} from "@utils/interfaces/group";
import {Document, document} from "postcss";
import {DIR_DOCUMENT} from "@angular/cdk/bidi";
import {DataService} from "@utils/services/data.service";
import {User} from "@utils/interfaces/user";
import {ToastService} from "@utils/services/toast.service";

@Component({
  selector: 'component-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgTemplateOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  router = inject(Router)
  dataService = inject(DataService)
  toastService = inject(ToastService)
  platformId = inject(PLATFORM_ID)

  groups: Group[] = []

  scrollLeft(element_id: string) {
    if (isPlatformBrowser(this.platformId)) {
      let panels = window.document.getElementById(element_id)
      if (panels) {
        let distance = panels.scrollLeft - 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }

  scrollRight(element_id: string) {
    if (isPlatformBrowser(this.platformId)) {
      let panels = window.document.getElementById(element_id)
      if (panels) {
        let distance = panels.scrollLeft + 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }

  ngOnInit(): void {
    let req = this.dataService.requestGroupPanels()
    if (typeof req !== "boolean") {
      req.subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Abfragen der Gruppen-Panels fehlgeschlagen!', bor: 3000})
          } else {
            this.groups = data.groups
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
}
