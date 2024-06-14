import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'component-toast',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

}
