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

  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submitted: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  createAccount() {
    let user = <User>{firstname:this.f['firstName'].value, lastname:this.f['lastName'].value, email:this.f['email'].value, password:this.f['password'].value,}
  this.accountService.createAccount(user)
  }
}

