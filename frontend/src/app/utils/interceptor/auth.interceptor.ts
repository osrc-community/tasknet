import { HttpInterceptorFn } from '@angular/common/http';
import {StorageService} from "@utils/services/storage.service";
import {inject} from "@angular/core";
import {User} from "@utils/interfaces/user";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let storageService = inject(StorageService)
  let user: User = storageService.getUser()

  const authReq = req.clone({
    setParams: {
      auth_token: `${user.token}`,
      auth_user: `${user.id}`
    }
  });

  return next(authReq);
};
