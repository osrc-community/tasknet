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
import {Loginuser} from "@utils/interfaces/loginuser";
import {StorageService} from "@utils/services/storage.service";

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

    let user = <Loginuser>{"email": this.f['email'].value, "password": this.f['password'].value}

    this.authService.login(user).subscribe({
      next: data => {
        if (data.success == 0) {
          console.log("Failed to log in!") //TODO mit Toast ersetzen!
        } else {
          this.storageService.saveUser(data['user']);
          console.log("Login Successfully") //TODO mit Toast ersetzen!
          window.location.reload();
        }
      },
      error: err => {
        console.log("Failed to log in!") //TODO mit Toast ersetzen!
      }
    });
  }
}
