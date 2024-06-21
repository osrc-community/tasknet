import {Component, inject, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {NgIf} from "@angular/common";
import {ModalComponent} from "@app/components/modal/modal.component";
import {Subscription} from "rxjs";
import {ModalService} from "@utils/services/modal.service";

@Component({
  selector: 'component-test',
  standalone: true,
  imports: [
    NgIf,
    ModalComponent
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  modalService = inject(ModalService)

  createModal(template: TemplateRef<any>) {
    this.modalService.open(template, 'Template Modal Title', 'max-w-md', this.onConfirm, {"message":"test-message"});
  }

  onConfirm() {
    console.log('Modal confirmed!');
    // Additional logic on confirmation
  }
}
