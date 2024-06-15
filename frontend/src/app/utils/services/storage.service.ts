import {inject, Injectable} from '@angular/core';
import {User} from "@utils/interfaces/user";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  clean(): void {
    localStorage.clear();
  }

  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return <User>JSON.parse(user);
    }

    return <User>{};
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem(USER_KEY);
    return !!user;
  }
}
