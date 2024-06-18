export class Toast {
  constructor(
    public id: number,
    public type: 'success' | 'info' | 'danger' | 'warning',
    public text: string,
    public bor: number
  ) {}
}

export interface Toast {
  id: number;
  type: 'success' | 'info' | 'danger' | 'warning';
  text: string;
  bor: number;
}

export interface ToastWithoutID {
  type: 'success' | 'info' | 'danger' | 'warning';
  text: string;
  bor: number;
}
