import { AbstractControl, ValidationErrors } from "@angular/forms";

export const lettersRegex: RegExp = /^[a-zA-z]+$/;
export const lettersNoMatchErrorMessage: string = 'Street must contain a-z or A-Z characters without whitespaces';

export const StreetValidator = function (control: AbstractControl): ValidationErrors | null {
  const street = control.value;
  let error = {};

  if (street) {
    const hasLetters = lettersRegex.test(street);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage };
    }
  }

  return error;
}
