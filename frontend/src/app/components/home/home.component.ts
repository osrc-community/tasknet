import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {Group} from "@utils/interfaces/group";
import {DataService} from "@utils/services/data.service";
import {ToastService} from "@utils/services/toast.service";
import {FormsModule} from "@angular/forms";
import {Panel} from "@utils/interfaces/panel";

@Component({
  selector: 'component-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgTemplateOutlet,
    NgIf,
    FormsModule
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
  show_name_modal: boolean = false
  modal_output: string = "";
  modal_function: string = ""
  group_index: number = -1

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
    this.dataService.requestGroupPanels().subscribe({
      next: data => {
        if (data.success == 0) {
          this.toastService.notify({type: 'danger', text: 'Abfragen der Gruppen-Panels fehlgeschlagen!', bor: 3000})
        } else {
          this.groups = data.groups
        }
      }
    });
  }

  toggleNameModal() {
    this.show_name_modal = !this.show_name_modal
  }

  createPanelInGroup(group_index: number) {
    this.modal_function = 'name_panel'
    this.group_index = group_index
    this.toggleNameModal()
  }

  modalFunction() {
    if (this.modal_function == 'name_panel') {
      let panel: Panel = {image: "assets/images/example.png", title: this.modal_output}
      this.dataService.panel_create(panel).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'danger', text: 'Erstellen des Panels fehlgeschlagen!', bor: 3000})
          } else {
            this.groups[this.group_index].panels!.push(data.panel)
          }
        }
      });
    }
  }
}
