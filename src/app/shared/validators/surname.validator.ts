import { AbstractControl, ValidationErrors } from "@angular/forms";

export const lettersRegex: RegExp = /^[a-zA-z]+$/;
export const lettersNoMatchErrorMessage: string = 'Surname must contain a-z or A-Z characters without whitespaces';

export const SurnameValidator = function (control: AbstractControl): ValidationErrors | null {
  const surname = control.value;
  let error = {};

  if (surname) {
    const hasLetters = lettersRegex.test(surname);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage };
    }
  }

  return error;
}
