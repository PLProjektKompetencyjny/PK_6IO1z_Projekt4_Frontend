import { AbstractControl, ValidationErrors } from "@angular/forms";

export const lettersRegex: RegExp = /^[a-zA-z]+$/;
export const lettersNoMatchErrorMessage: string = 'Name must contain a-z or A-Z characters without whitespaces';

export const NameValidator = function (control: AbstractControl): ValidationErrors | null {
  const name = control.value;
  let error = {};

  if (name) {
    const hasLetters = lettersRegex.test(name);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage };
    }
  }

  return error;
}
