import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "@utils/services/authentication.service";
import {StorageService} from "@utils/services/storage.service";
import {Router} from "@angular/router";
import {ToastService} from "@utils/services/toast.service";

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
  private toastService = inject(ToastService);

  user = this.storageService.getUser();

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      if (this.user.id) {
        this.authService.logout(this.user.id).subscribe({
          next: () => {
            this.storageService.clean()
            this.router.navigateByUrl('/');
          },
          error: err => {
            this.toastService.notify({type: 'danger', text: 'Fehler während des Abemldens: ' + err, bor: 10000})
          }
        });
      }
    }
  }
}
