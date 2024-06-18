import { Injectable } from '@angular/core';
import {Toast, ToastWithoutID} from "@app/utils/interfaces/toast";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _subject = new Subject<Toast>();
  private idx = 0;
  constructor() {}

  getObservable(): Observable<Toast> {
    return this._subject.asObservable();
  }

  notify(notification: ToastWithoutID) {
    this._subject.next(new Toast(this.idx++, notification.type, notification.text, notification.bor));
  }
}
