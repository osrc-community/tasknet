import { Routes } from '@angular/router';
import {LogoutComponent} from "@app/components/logout/logout.component";
import {HomeComponent} from "@app/components/home/home.component";
import {TestComponent} from "@app/components/test/test.component";
import {PanelComponent} from "@app/components/panel/panel.component";
import {UserSettingsComponent} from "@app/components/user-settings/user-settings.component";
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {SettingsProfileComponent} from "@app/components/settings/settings-profile/settings-profile.component";
import {SettingsSecurityComponent} from "@app/components/settings/settings-security/settings-security.component";
import {SettingsGroupComponent} from "@app/components/settings/settings-group/settings-group.component";

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
  /*{
    path: "user-settings/:page",
    component: UserSettingsComponent
  },*/
  {
    path: "settings",
    children: [
      {
        path: "profile",
        component: SettingsProfileComponent,
      },
      {
        path: "security",
        component: SettingsSecurityComponent,
      },
      {
        path: "group",
        component: SettingsGroupComponent,
      }
    ]
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
