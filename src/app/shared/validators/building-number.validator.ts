import { AbstractControl, ValidationErrors } from "@angular/forms";

export const formatRegex: RegExp = /^\d+(\s[A-Za-z])?$/;
export const formatNoMatchErrorMessage: string = 'Building number must contain number and optionally a-z or A-Z characters';

export const BuildingNumberValidator = function (control: AbstractControl): ValidationErrors | null {
  const street = control.value;
  let error = {};

  if (street) {
    const hasLetters = formatRegex.test(street);

    if (hasLetters === false) {
      error = { ...error, lettersNoMatchErrorMessage: formatNoMatchErrorMessage };
    }
  }

  return error;
}
