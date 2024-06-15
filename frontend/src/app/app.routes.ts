import { Routes } from '@angular/router';
import {LogoutComponent} from "@app/components/logout/logout.component";
import {HomeComponent} from "@app/components/home/home.component";
import {TestComponent} from "@app/components/test/test.component";
import {PanelComponent} from "@app/components/panel/panel.component";

export const routes: Routes = [
  {
    path: "logout",
    component: LogoutComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "test",
    component: TestComponent
  },
  {
    path: "panels/:identifier",
    component: PanelComponent
  },
  {
    path: "**",
    redirectTo: "home"
  }
];
