import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthenticationService} from "@utils/services/authentication.service";
import {User} from "@utils/interfaces/user";
import {StorageService} from "@utils/services/storage.service";
import {environment} from "@env/environment";
import {ToastService} from "@utils/services/toast.service";
import {Toast, ToastWithoutID} from "@utils/interfaces/toast";
import {Router} from "@angular/router";

@Component({
  selector: 'component-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private storageService = inject(StorageService)
  private toastService = inject(ToastService)
  protected router = inject(Router)

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submitted: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let user = <User>{"email": this.f['email'].value, "password": this.f['password'].value}

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
          window.location.reload();
        }
      },
      error: err => {
        this.toastService.notify({type: 'danger', text: 'Anmeldung Fehlgeschlagen!', bor: 3000})
      }
    });
  }

  protected readonly environment = environment;
}
