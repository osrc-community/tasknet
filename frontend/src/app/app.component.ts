import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {initFlowbite} from "flowbite";
import {StorageService} from "@utils/services/storage.service";
import {AuthenticationService} from "@utils/services/authentication.service";
import {environment} from "@env/environment";
import {ToastComponent} from "@app/components/toast/toast.component";
import {LoginComponent} from "@app/components/login/login.component";
import {NavigationComponent} from "@app/components/navigation/navigation.component";
import {SignUpComponent} from "@app/components/sign-up/sign-up.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, LoginComponent, NavigationComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  storageService: StorageService = inject(StorageService);
  protected router = inject(Router);

  loginRequired = environment.loginRequired;
  title = 'TaskNet';

  ngOnInit(): void {
    initFlowbite();
  }
}
