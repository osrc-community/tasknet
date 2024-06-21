import {
  Component,
  EventEmitter,
  Output,
  Input,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  inject
} from '@angular/core';
import { ModalService } from '@utils/services/modal.service';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'component-modal',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    NgIf,
    FormsModule
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  private modalService: ModalService = inject(ModalService);

  @Output() close = new EventEmitter<void>();
  @Input() title!: string;
  @Input() size!: string;
  @Input() templateRef!: TemplateRef<any>;
  @Input() contentComponent!: any;
  @Input() context!: any;
  @Input() callback!: Function;

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true }) modalContainer!: ViewContainerRef;

  ngAfterViewInit() {
    if (this.contentComponent) {
      const componentFactory = this.modalContainer.parentInjector.get(ComponentFactoryResolver).resolveComponentFactory(this.contentComponent);
      this.modalContainer.createComponent(componentFactory);
    }
  }

  closeModal() {
    this.close.emit();
    this.modalService.close();
  }

  confirm(event: any) {
    if (this.callback) {
      this.callback(event);
    }
    this.closeModal();
  }
}
