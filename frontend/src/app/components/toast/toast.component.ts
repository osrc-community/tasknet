import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Toast} from "@app/utils/interfaces/toast";
import {NgClass, NgForOf, NgTemplateOutlet} from "@angular/common";
import {Subscription} from "rxjs";
import {ToastService} from "@app/utils/services/toast.service";

@Component({
  selector: 'component-toast',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
  private _subscription!: Subscription;
  protected toastService = inject(ToastService)
  notifications: Toast[] = []

  private _addNotification(notification: Toast) {
    this.notifications.push(notification);

    if (notification.bor !== 0) {
      setTimeout(() => this.close(notification), notification.bor);
    }
  }

  close(notification: Toast) {
    this.notifications = this.notifications.filter(notify => notify.id !== notification.id);
  }

  ngOnInit() {
    this._subscription = this.toastService.getObservable().subscribe(notification => this._addNotification(notification));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
