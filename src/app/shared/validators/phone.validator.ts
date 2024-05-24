import { AbstractControl, ValidationErrors } from "@angular/forms";

export const specialCharRegex: RegExp = /^\+/;
export const specialCharNoMatchErrorMessage: string = 'Phone must start with "+" character';

export const digitsRegex: RegExp = /\d{11}$/;
export const digitsNoMatchErrorMessage: string = 'Phone must contain 11 digits without whitespaces';

export const PhoneValidator = function (control: AbstractControl): ValidationErrors | null {
  const phone = control.value;
  let error = {};

  if (phone) {
    const hasSpecialChar = specialCharRegex.test(phone);
    const hasDigits = digitsRegex.test(phone);

    if (hasSpecialChar === false) {
      error = { ...error, specialCharNoMatchErrorMessage };
    }

    if (hasDigits === false) {
      error = { ...error, digitsNoMatchErrorMessage };
    }
  }

  return error;
}
