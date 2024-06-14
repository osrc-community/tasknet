import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "@utils/services/authentication.service";
import {StorageService} from "@utils/services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'component-logout',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class LogoutComponent implements OnInit {
  authService = inject(AuthenticationService)
  storageService = inject(StorageService)
  router = inject(Router)

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.authService.logout().subscribe({
        next: () => {
          this.storageService.clean()
          this.router.navigateByUrl('/');
        },
        error: err => {
          //this.toastService.notify({type: 'danger', text: 'Something went wrong while Logout: ' + err, bor: 10000}) TODO ersetzen durch Toast-Service
          console.log('Something went wrong while Logout: ' + err)
        }
      });
    }
  }
}
