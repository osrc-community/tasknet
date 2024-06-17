import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, RouterOutlet } from '@angular/router';
import {initFlowbite} from "flowbite";
import {StorageService} from "@utils/services/storage.service";
import {AuthenticationService} from "@utils/services/authentication.service";
import {environment} from "@env/environment";
import {ToastComponent} from "@app/components/toast/toast.component";
import {LoginComponent} from "@app/components/login/login.component";
import {NavigationComponent} from "@app/components/navigation/navigation.component";
import { Router } from 'express';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, LoginComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  storageService: StorageService = inject(StorageService);
  protected authService = inject(AuthenticationService);
  route: ActivatedRoute = inject(ActivatedRoute)
  currentRoute = this.route.snapshot.url
  loginRequired = environment.loginRequired;
  title = 'TaskNet';

  ngOnInit(): void {
    initFlowbite();
  }
}
