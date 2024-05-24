import { AbstractControl, ValidationErrors } from "@angular/forms";

export const digitsRegex: RegExp = /^\d{10}$/;
export const digitsNoMatchErrorMessage: string = 'NIP must contain 10 digits without whitespaces';

export const NipValidator = function (control: AbstractControl): ValidationErrors | null {
  const nip = control.value;
  let error = {};

  if (nip) {
    const hasDigits = digitsRegex.test(nip);

    if (hasDigits === false) {
      error = { ...error, digitsNoMatchErrorMessage };
    }
  }

  return error;
}
