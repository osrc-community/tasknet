import {inject, Injectable} from '@angular/core';
import {User} from "@utils/interfaces/user";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http = inject(HttpClient)
  backend = environment.backend_url


  createAccount(user: User): Observable<any> {
    return this.http.post(
      this.backend + '/account/create',
      {
        "email": user.email,
        "password": user.password,
        "firstname": user.firstname,
        "lastname": user.lastname
      }
    );
  }

  updateAccount(user: User): Observable<any> {
    return this.http.post(
      this.backend + '/account/update',
      user
    );
  }

  deleteAccount(email: string): Observable<any> {
    return this.http.delete(
      this.backend + '/account/delete',
      {"body":{"email": email}}
    );
  }
}
