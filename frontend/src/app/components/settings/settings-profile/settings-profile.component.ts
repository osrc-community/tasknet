import {Component, inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StorageService} from "@utils/services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "@utils/services/account.service";
import {DataService} from "@utils/services/data.service";
import {ToastService} from "@utils/services/toast.service";
import {User} from "@utils/interfaces/user";
import {Group} from "@utils/interfaces/group";
import {SettingsNavigationComponent} from "@app/components/settings/settings-navigation/settings-navigation.component";

@Component({
  selector: 'component-settings-profile',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SettingsNavigationComponent
  ],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss'
})
export class SettingsProfileComponent {
  formBuilder = inject(FormBuilder);
  storageService = inject(StorageService);
  router = inject(Router);
  accountService = inject(AccountService);
  toastService = inject(ToastService);

  user: User = this.storageService.getUser();
  showModal = false;
  groups: Group[] = []

  form: FormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
  });
  submitted: boolean = false;

  image: string | ArrayBuffer | null = "";
  image_event: any;

  ngOnInit(): void {
    this.user = this.storageService.getUser()

    this.form = this.formBuilder.group(
      {
        firstname: [this.user.firstname, [Validators.required]],
        lastname: [this.user.lastname, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  toggleUploadImageModal() {
    this.showModal = !this.showModal
  }

  processImage() {
    let new_user: User = <User>{email: this.user.email, image: this.image}
    this.accountService.updateAccount(new_user).subscribe({
      next: data => {
        if (data.success == 0) {
          this.toastService.notify({type: 'warning', text: 'Updaten des Bildes fehlgeschlagen!', bor: 3000})
        } else {
          this.toastService.notify({type: 'info', text: 'Melde dich erneut an, um deinen Nutzer zu Aktualisieren.', bor: 3000})
          this.toggleUploadImageModal()
        }
      }
    });
  }

  readUrl(event:any) {
    this.image_event = event;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.image = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  deleteImage() {
    let new_user: User = <User>{email: this.user.email, image: ''}
    this.accountService.updateAccount(new_user).subscribe({
      next: data => {
        if (data.success == 0) {
          this.toastService.notify({type: 'warning', text: 'Löschen des Bildes fehlgeschlagen!', bor: 3000})
        } else {
          this.toastService.notify({type: 'info', text: 'Melde dich erneut an, um deinen Nutzer zu Aktualisieren.', bor: 3000})
        }
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let user: User = <User>{
      email: this.f['email'].value,
      firstname: this.f['firstname'].value,
      lastname: this.f['lastname'].value
    }

    this.accountService.updateAccount(user).subscribe({
      next: data => {
        if (data.success == 0) {
          this.toastService.notify({
            type: 'warning',
            text: 'Etwas ist beim Updaten des Nutzers schiefgelaufen. Probiere es später erneut.',
            bor: 3000
          })
        } else {
          this.toastService.notify({
            type: 'info',
            text: 'Aktualisierung des Nutzers erfolgreich. Melde dich erneut an, um die Aktualisierung zu beenden.',
            bor: 3000
          })
        }
      }
    });
  }
}
