import {Component, inject} from '@angular/core';
import {SettingsNavigationComponent} from "@app/components/settings/settings-navigation/settings-navigation.component";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {StorageService} from "@utils/services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "@utils/services/data.service";
import {ToastService} from "@utils/services/toast.service";
import {User} from "@utils/interfaces/user";
import {Group} from "@utils/interfaces/group";

@Component({
  selector: 'component-settings-group',
  standalone: true,
  imports: [
    SettingsNavigationComponent,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './settings-group.component.html',
  styleUrl: './settings-group.component.scss'
})
export class SettingsGroupComponent {
  formBuilder = inject(FormBuilder);
  storageService = inject(StorageService);
  router = inject(Router);
  dataService = inject(DataService);
  toastService = inject(ToastService);

  user: User = this.storageService.getUser();
  groups: Group[] = []

  group_form: FormGroup = new FormGroup({
    group_name: new FormControl()
  });
  group_form_submitted: boolean = false;

  image: string | ArrayBuffer | null = "";
  selectedGroup: string = "-";

  ngOnInit(): void {
    this.user = this.storageService.getUser()

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

  get group_f(): { [key: string]: AbstractControl } {
    return this.group_form.controls;
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
