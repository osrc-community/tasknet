import {inject, Injectable} from '@angular/core';
import {Loginuser} from "@utils/interfaces/loginuser";
import {environment} from "@env/environment";
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {StorageService} from "@utils/services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  storageService = inject(StorageService);
  http = inject(HttpClient);
  backend = environment.backend_url;

  login(user: Loginuser): Observable<any> {
    return this.http.post(
      this.backend + '/auth/login',
      {"email": user.email, "password": user.password}
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.backend + '/auth/logout', {});
  }
}
