import {Component, inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SettingsNavigationComponent} from "@app/components/settings/settings-navigation/settings-navigation.component";
import {StorageService} from "@utils/services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "@utils/services/account.service";
import {DataService} from "@utils/services/data.service";
import {ToastService} from "@utils/services/toast.service";
import {User} from "@utils/interfaces/user";
import {Group} from "@utils/interfaces/group";

@Component({
  selector: 'component-settings-security',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SettingsNavigationComponent
  ],
  templateUrl: './settings-security.component.html',
  styleUrl: './settings-security.component.scss'
})
export class SettingsSecurityComponent {
  formBuilder = inject(FormBuilder);
  storageService = inject(StorageService);
  router = inject(Router);
  accountService = inject(AccountService);
  toastService = inject(ToastService);

  user: User = this.storageService.getUser();
  groups: Group[] = []

  form: FormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  submitted: boolean = false;

  password_form: FormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  password_form_submitted: boolean = false;

  group_form: FormGroup = new FormGroup({
    group_name: new FormControl()
  });

  image: string | ArrayBuffer | null = "";

  ngOnInit(): void {
    this.user = this.storageService.getUser()

    this.form = this.formBuilder.group(
      {
        firstname: [this.user.firstname, [Validators.required]],
        lastname: [this.user.lastname, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
      }
    );

    this.password_form = this.formBuilder.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required]],
        val_password: ['', [Validators.required]]
      }
    );

    this.group_form = this.formBuilder.group(
      {
        group_name: ['', [Validators.required]]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get password_f(): { [key: string]: AbstractControl } {
    return this.password_form.controls;
  }

  deleteAccount() {
    if (this.user.email != null) {
      this.accountService.deleteAccount(this.user.email).subscribe({
        next: data => {
          this.toastService.notify({
            type: 'info',
            text: 'Deaktierung deines Accounts vollständig. Du wirst jetzt abgemeldet!',
            bor: 3000
          })
          this.router.navigateByUrl('/logout')
        }
      });
    }
  }

  updatePassword(){
    this.password_form_submitted = true;
    if (this.password_form.invalid) {
      return;
    }

    if (this.password_form.valid) {
      let user: User = <User>{
        email: this.f['email'].value,
        password: this.password_f['new_password'].value
      }

      this.accountService.updateAccount(user).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'warning', text: 'Etwas ist beim Updaten des Nutzers schiefgelaufen. Probiere es später erneut.', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Aktualisierung des Nutzers erfolgreich. Melde dich erneut an, um die Aktualisierung zu beenden.', bor: 3000})
          }
        }
      });
    }
  }
}
