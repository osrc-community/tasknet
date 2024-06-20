import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {StorageService} from "@utils/services/storage.service";
import {Group} from "@utils/interfaces/group";
import {Router} from "@angular/router";
import {Panel} from "@utils/interfaces/panel";
import {PanelList} from "@utils/interfaces/panel-list";
import {List} from "postcss/lib/list";
import {PanelListItem} from "@utils/interfaces/panel-list-item";

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

  group_create(group: Group): Observable<any> {
    return this.http.post(
      this.backend + '/func/group/create',
      group
    );
  }

  group_update(group: Group): Observable<any> {
    return this.http.patch(
      this.backend + '/func/group/patch',
      group
    );
  }

  group_delete(group_identifier: string): Observable<any> {
    return this.http.delete(
      this.backend + '/func/group/delete/' + group_identifier,
    );
  }

  panel_create(panel: Panel): Observable<any> {
    return this.http.post(
      this.backend + '/func/panel/create',
      panel
    );
  }

  panel_update(panel: Panel): Observable<any> {
    return this.http.patch(
      this.backend + '/func/panel/patch',
      panel
    );
  }

  panel_delete(panel_identifier: string): Observable<any> {
    return this.http.delete(
      this.backend + '/func/panel/delete/' + panel_identifier
    );
  }

  list_create(list: PanelList, panel_identifier: string): Observable<any> {
    return this.http.post(
      this.backend + '/func/list/create/' + panel_identifier,
      list
    );
  }

  list_update(list: PanelList): Observable<any> {
    return this.http.patch(
      this.backend + '/func/list/patch',
      list
    );
  }

  list_delete(list_identifier: string): Observable<any> {
    return this.http.delete(
      this.backend + '/func/list/delete/' + list_identifier
    );
  }

  entry_create(entry: PanelListItem, list_identifier: string): Observable<any> {
    return this.http.post(
      this.backend + '/func/entry/create',
      entry
    );
  }

  entry_update(entry: PanelListItem): Observable<any> {
    return this.http.patch(
      this.backend + '/func/entry/patch',
      entry
    );
  }

  entry_delete(entry_identifier: string): Observable<any> {
    return this.http.delete(
      this.backend + '/func/entry/delete/' + entry_identifier
    );
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
