import {Component, inject, OnInit} from '@angular/core';
import {User} from "@utils/interfaces/user";
import {StorageService} from "@utils/services/storage.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "@utils/services/account.service";
import {DataService} from "@utils/services/data.service";
import {Group} from "@utils/interfaces/group";
import {ToastService} from "@utils/services/toast.service";
import {isSetEqual} from "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph";

@Component({
  selector: 'component-user-settings',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgOptimizedImage,
    FormsModule,
    NgForOf
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  storageService = inject(StorageService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  accountService = inject(AccountService);
  dataService = inject(DataService);
  toastService = inject(ToastService);

  page = this.activatedRoute.snapshot.params['page'];
  pages = ["general", "security", "groups",]
  user: User = this.storageService.getUser();
  showModal = false;
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
  group_form_submitted: boolean = false;

  image: string | ArrayBuffer | null = "";
  image_event: any;
  selectedGroup: string = "-";

  ngOnInit(): void {
    this.user = this.storageService.getUser()
    if (!(this.pages.includes(this.page))) {
      location.href = 'user-settings/general'
    }

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

    this.requestGroups();
  }

  requestGroups() {
    this.dataService.requestGroupPanels().subscribe({
      next: (data) => {
        this.groups = data.groups
      }
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get password_f(): { [key: string]: AbstractControl } {
    return this.password_form.controls;
  }

  get group_f(): { [key: string]: AbstractControl } {
    return this.group_form.controls;
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

  createGroup() {
    this.group_form_submitted = true;
    if (this.group_form.invalid) {
      return;
    }

    if (this.group_form.valid) {
      this.dataService.group_create(this.group_f['group_name'].value).subscribe({
        next: data => {
          if (data.success == 0) {
            this.toastService.notify({type: 'warning', text: 'Etwas ist beim erstellen der Gruppe fehlgeschlagen.', bor: 3000})
          } else {
            this.toastService.notify({type: 'info', text: 'Gruppe erstellt!', bor: 3000})
            this.requestGroups();
          }
        }
      });
    }
  }

  renamegroup(){

  }//Todo Funktion mit dem Backend kombinieren

  deletegroup() {

  }//Todo Funktion mit dem Backend kombinieren

  adduser(){

  }//Todo Funktion mit dem Backend kombinieren

  removeuser(){

  }//todo Funktion mit dem Backend kombinieren
}
