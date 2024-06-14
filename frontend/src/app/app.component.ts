import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AuthenticationService} from "@utils/services/authentication.service";
import {LoginComponent} from "./components/login/login.component";
import {environment} from "@env/environment";
import {StorageService} from "@utils/services/storage.service";
import {ToastComponent} from "@app/components/toast/toast.component";
import {NavigationComponent} from "@app/components/navigation/navigation.component";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, ToastComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  storageService: StorageService = inject(StorageService);
  loginRequired = environment.loginRequired;
  protected authService = inject(AuthenticationService);
  title = 'TaskNet';

  ngOnInit(): void {
    initFlowbite();
  }
}
