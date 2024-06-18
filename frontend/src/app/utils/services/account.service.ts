import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {User} from "@utils/interfaces/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http = inject(HttpClient);
  backend = environment.backend_url;

  createAccount(user: User): Observable<any> {
    return this.http.post(
      this.backend + '/account/create',
      {"firstName": user.firstname, "lastName": user.lastname,"email": user.email, "password": user.password}
    );
    //TODO funktion integrieren

  }

  updateAccount() {

  }

  deleteAccount() {

  }
}
