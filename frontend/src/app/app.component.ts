import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {initFlowbite} from "flowbite";
import {StorageService} from "@utils/services/storage.service";
import {AuthenticationService} from "@utils/services/authentication.service";
import {environment} from "@env/environment";
import {ToastComponent} from "@app/components/toast/toast.component";
import {LoginComponent} from "@app/components/login/login.component";
import {NavigationComponent} from "@app/components/navigation/navigation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, LoginComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  storageService: StorageService = inject(StorageService);
  loginRequired = environment.loginRequired;
  protected authService = inject(AuthenticationService);
  title = 'TaskNet';

  ngOnInit(): void {
    initFlowbite();
  }
}
