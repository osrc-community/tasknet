import {inject, Injectable} from '@angular/core';
import {Loginuser} from "@utils/interfaces/loginuser";
import {BrowserStorageService} from "@utils/services/browser-storage.service";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  sessionStorage = inject(BrowserStorageService)

  clean(): void {
    this.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    this.sessionStorage.remove(USER_KEY);
    this.sessionStorage.set(USER_KEY, JSON.stringify(user));
  }

  public getUser(): Loginuser {
    const user = this.sessionStorage.get(USER_KEY);
    if (user) {
      return <Loginuser>JSON.parse(user);
    }

    return <Loginuser>{};
  }

  public isLoggedIn(): boolean {
    const user = this.sessionStorage.get(USER_KEY);
    return !!user;
  }
}
