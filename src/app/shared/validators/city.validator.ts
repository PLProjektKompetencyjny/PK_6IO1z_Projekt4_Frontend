import { AbstractControl, ValidationErrors } from "@angular/forms";

export const lettersRegex: RegExp = /^[a-zA-z]+$/;
export const lettersNoMatchErrorMessage: string = 'City must contain a-z or A-Z characters without whitespaces';

export const CityValidator = function (control: AbstractControl): ValidationErrors | null {
  const city = control.value;
  let error = {};

  if (city) {
    const hasLetters = lettersRegex.test(city);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage };
    }
  }

  return error;
}
