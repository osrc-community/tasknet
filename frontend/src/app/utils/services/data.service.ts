import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {StorageService} from "@utils/services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  http = inject(HttpClient)
  storageService = inject(StorageService)
  backend = environment.backend_url
  user = this.storageService.getUser()

  requestGroupPanels(): Observable<any> | boolean {
    if (this.user.token && this.user.id) {
      return this.http.get(
        this.backend + '/func/groups_panels',
        {params: {'auth_token': this.user.token, 'auth_user': this.user.id}}
      );
    } else {
      return false
    }
  }
}
