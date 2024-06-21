import { Injectable, ComponentRef, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, TemplateRef } from '@angular/core';
import { ModalComponent } from '@app/components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;
  private viewRef: EmbeddedViewRef<any> | null = null;

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  open(templateOrComponent: TemplateRef<any> | any, title: string, size: string, callback: Function, data?: any) {
    this.close();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    this.modalComponentRef = componentFactory.create(this.injector);

    this.modalComponentRef.instance.title = title;
    this.modalComponentRef.instance.size = size;
    this.modalComponentRef.instance.callback = callback;

    if (templateOrComponent instanceof TemplateRef) {
      this.modalComponentRef.instance.templateRef = templateOrComponent;
      this.modalComponentRef.instance.context = data;
    } else {
      this.modalComponentRef.instance.contentComponent = templateOrComponent;
    }

    this.applicationRef.attachView(this.modalComponentRef.hostView);
    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  close() {
    if (this.viewRef) {
      this.applicationRef.detachView(this.viewRef);
      this.viewRef.destroy();
      this.viewRef = null;
    }

    if (this.modalComponentRef) {
      this.applicationRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}