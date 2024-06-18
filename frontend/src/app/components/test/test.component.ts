import {Component, inject} from '@angular/core';
import {ToastService} from "@utils/services/toast.service";

@Component({
  selector: 'component-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  toastService = inject(ToastService);

}
