import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {ToastService} from "@utils/services/toast.service";
import {inject} from "@angular/core";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let toastService = inject(ToastService)

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          toastService.notify({type: "info", text: "Deine Session ist abgelaufen. Melde dich erneut an, um weiter zu arbeiten.", bor: 3000})
          window.location.href = "/logout"
        } else {
          toastService.notify({type: "info", text: "Es ist ein fehler aufgetreten: " + err.message, bor: 3000})
        }
      } else {
        toastService.notify({type: "info", text: "Es ist ein fehler aufgetreten: " + err.message, bor: 3000})
      }

      return throwError(() => err);
    })
  );
};
