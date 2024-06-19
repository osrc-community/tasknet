import {Component, inject, OnInit} from '@angular/core';
import {User} from "@utils/interfaces/user";
import {StorageService} from "@utils/services/storage.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
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

@Component({
  selector: 'component-user-settings',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  storageService = inject(StorageService)
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  accountService = inject(AccountService);

  page = this.activatedRoute.snapshot.params['page'];
  pages = ["general", "security"]
  user: User = this.storageService.getUser();
  showModal = false;

  form: FormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  submitted: boolean = false;

  image: string | ArrayBuffer | null = "";
  image_event: any;

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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  toggleUploadImageModal() {
    this.showModal = !this.showModal
  }

  processImage() {
    let new_user: User = <User>{image: ''}
    this.accountService.updateAccount(new_user).subscribe({
      next: data => {
        if (data.success == 0) {
          console.log("Failed to log in!") //TODO mit Toast ersetzen!
        } else {
          console.log("Hat jeklappt") //TODO mit Toast ersetzen!
        }
      },
      error: err => {
        console.log("Failed to log in!") //TODO mit Toast ersetzen!
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
    console.log("Delete Image!")
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  }
  deleteAccount() {

  }
}
