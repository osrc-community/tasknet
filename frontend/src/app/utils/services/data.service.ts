import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {StorageService} from "@utils/services/storage.service";
import {Group} from "@utils/interfaces/group";
import {Router} from "@angular/router";
import {Panel} from "@utils/interfaces/panel";

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  http = inject(HttpClient)
  router = inject(Router)
  backend = environment.backend_url

  ngOnInit(): void {}

  requestGroupPanels(): Observable<any> {
    return this.http.get(
      this.backend + '/func/groups_panels'
    );
  }

  requestLists(identifier: string): Observable<any> {
    return this.http.get(
      this.backend + '/func/panel/' + identifier
    );
  }

  group_create(group: Group) {

  }

  group_update(group: Group) {

  }

  group_delete(group_identifier: string) {

  }

  panel_create(group: Group) {

  }

  panel_update(panel: Panel): Observable<any> {
    return this.http.post(
      this.backend + '/func/patch',
      panel
    );
  }

  panel_delete(group_identifier: string) {

  }

  list_create(group: Group) {

  }

  list_update(group: Group) {

  }

  list_delete(group_identifier: string) {

  }

  entry_create(group: Group) {

  }

  entry_update(group: Group) {

  }

  entry_delete(group_identifier: string) {

  }

  /*
    - /group/create  :post
    - /group/patch   :patch
    - /group/delete  :delete
    - /panel/create  :post
    - /panel/patch   :patch
    - /panel/delete  :delete
    - /list/create   :post
    - /list/patch    :patch
    - /list/delete   :delete
    - /entry/create  :post
    - /entry/patch   :patch
    - /entry/delete  :delete
  */
}
