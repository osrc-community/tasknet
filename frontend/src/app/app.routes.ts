import { Routes } from '@angular/router';
import {LogoutComponent} from "@app/components/logout/logout.component";
import {HomeComponent} from "@app/components/home/home.component";

export const routes: Routes = [
  {
    path: "logout",
    component: LogoutComponent
  },
  {
    path: "logout",
    component: LogoutComponent
  },
  {
    path: "**",
    component: HomeComponent
  }
];
