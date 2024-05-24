import { AbstractControl, ValidationErrors } from "@angular/forms";

export const lettersRegex: RegExp = /^[a-zA-z]+$/;
export const lettersNoMatchErrorMessage: string = 'Firstname must contain a-z or A-Z characters without whitespaces';

export const FirstnameValidator = function (control: AbstractControl): ValidationErrors | null {
  const firstname = control.value;
  let error = {};

  if (firstname) {
    const hasLetters = lettersRegex.test(firstname);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage };
    }
  }

  return error;
}
