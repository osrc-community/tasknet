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
  private formBuilder: FormBuilder = inject(FormBuilder);
  storageService: StorageService = inject(StorageService)
  activatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  page = this.activatedRoute.snapshot.params['page'];
  pages = ["general", "security"]
  user: User = this.storageService.getUser();
  showModal = false;

  form: FormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    email: new FormControl(),
  });
  submitted: boolean = false;

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

  uploadImage() {
    this.toggleUploadImageModal()
  }

  toggleUploadImageModal() {
    this.showModal = !this.showModal
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
}
