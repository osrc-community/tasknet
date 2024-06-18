import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import { AuthenticationService } from '@app/utils/services/authentication.service';
import { StorageService } from '@app/utils/services/storage.service';
import {AccountService} from "@utils/services/account.service";
import {User} from "@utils/interfaces/user";
import {Router} from "@angular/router";
import {ToastService} from "@utils/services/toast.service";

@Component({
  selector: 'component-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountService = inject(AccountService)
  protected router = inject(Router);
  protected toastService = inject(ToastService)
  protected storageService = inject(StorageService)
  protected authService = inject(AuthenticationService)

  form: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submitted: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  createAccount() {
    if (this.form.valid) {
      let user = <User>{
        firstname:this.f['firstname'].value,
        lastname:this.f['lastname'].value,
        email:this.f['email'].value,
        password:this.f['password'].value,
      }

      this.accountService.createAccount(user).subscribe({
        next: data => {
          if (data.success) {
            this.toastService.notify({type: "info", text: data.message, bor: 3000})

            this.authService.login(user).subscribe({
              next: data => {
                if (data.success == 0) {
                  this.toastService.notify({type: 'danger', text: 'Anmeldung Fehlgeschlagen!', bor: 3000})
                } else {
                  let rtn_user = <User>data['user']
                  if (rtn_user.image == null) {
                    rtn_user.image = "assets/images/default_user.png"
                  }
                  this.storageService.saveUser(rtn_user);
                  this.router.navigateByUrl('home');
                }
              },
              error: err => {
                this.toastService.notify({type: 'danger', text: 'Anmeldung Fehlgeschlagen!', bor: 3000})
              }
            });
          } else {
            this.toastService.notify({type: 'danger', text: 'Fehler während des Account Erstellens: ' + data.message, bor: 10000})
          }
        },
        error: err => {
          this.toastService.notify({type: 'danger', text: 'Fehler während des Account Erstellens: ' + err, bor: 10000})
        }
      });
    } else {
      this.toastService.notify({type: "info", text: "Es sind nicht alle Felder ausgefüllt!", bor: 3000})
    }
  }
}

