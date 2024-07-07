import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultButtonCancel, defaultButtonOk, defaultMessage, defaultTitle, getButtonTypeClassName } from './confirmation-dialog.config';
import { Button } from './confirmation-dialog.model';

@Component({
  selector: 'tn-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  protected readonly getButtonTypeClassName = getButtonTypeClassName;

  @Input() title: string = defaultTitle;
  @Input() message: string = defaultMessage;
  @Input() buttonOk: Button = defaultButtonOk;
  @Input() buttonCancel: Button = defaultButtonCancel;

  constructor(private readonly activeModal: NgbActiveModal) { }

  decline() {
    this.activeModal.close(false);
  }

  accept() {
    this.activeModal.close(true);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
