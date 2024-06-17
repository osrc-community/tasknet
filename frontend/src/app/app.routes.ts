import { Routes } from '@angular/router';
import {LogoutComponent} from "@app/components/logout/logout.component";
import {HomeComponent} from "@app/components/home/home.component";
import {TestComponent} from "@app/components/test/test.component";
import {PanelComponent} from "@app/components/panel/panel.component";
import {UserSettingsComponent} from "@app/components/user-settings/user-settings.component";
import { SignUpComponent } from './components/sign-up/sign-up.component';

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
    path: "user-settings",
    component: UserSettingsComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "**",
    redirectTo: "home"
  }
];
