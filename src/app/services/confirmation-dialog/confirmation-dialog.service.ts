import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Button, ButtonType } from '../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { defaultButtonCancel } from '../../shared/components/confirmation-dialog/confirmation-dialog.config';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private readonly modalService: NgbModal) { }

  confirm(
    title: string,
    message: string,
    buttonOk: Button,
    buttonCancel: Button,
    dialogSize: 'sm' | 'lg' = 'sm',
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });

    (modalRef.componentInstance as ConfirmationDialogComponent).title = title;
    (modalRef.componentInstance as ConfirmationDialogComponent).message = message;
    (modalRef.componentInstance as ConfirmationDialogComponent).buttonOk = buttonOk;
    (modalRef.componentInstance as ConfirmationDialogComponent).buttonCancel = buttonCancel;

    return modalRef.result;
  }

  confirmDelete(
    title: string = 'Caution!',
    message: string = 'Are you sure you want to delete?',
    buttonDeleteText: string = 'Delete',
    dialogSize: 'sm' | 'lg' = 'sm',
  ): Promise<boolean> {
    const buttonOk: Button = {
      text: buttonDeleteText,
      type: ButtonType.DANGER,
    };

    return this.confirm(title, message, buttonOk, defaultButtonCancel, dialogSize);
  }
}
