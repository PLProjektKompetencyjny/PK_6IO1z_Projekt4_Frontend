import { AbstractControl, ValidationErrors } from "@angular/forms"

export const lowerCaseRegex: RegExp = /[a-z]+/;
export const lowerCaseNoMatchErrorMessage: string = 'Password must contain at least 1 lower case character';

export const upperCaseRegex: RegExp = /[A-Z]+/;
export const upperCaseNoMatchErrorMessage: string = 'Password must contain at least 1 upper case character';

export const digitRegex: RegExp = /\d+/;
export const digitNoMatchErrorMessage: string = 'Password must contain at least 1 digit';

export const specialCharRegex: RegExp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
export const specialCharNoMatchErrorMessage: string = 'Password must contain at least 1 special character';

export const minLength: number = 8;
export const minLengthErrorMessage: string = 'Password must be at least 8 characters long';

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  let error = {};

  if (password) {
    const hasLowerCase = lowerCaseRegex.test(password);
    const hasUpperCase = upperCaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
    const hasMinLength = password.length >= minLength;

    if (hasLowerCase === false) {
      error = { ...error, lowerCaseNoMatchErrorMessage };
    }

    if (hasUpperCase === false) {
      error = { ...error, upperCaseNoMatchErrorMessage };
    }

    if (hasDigit === false) {
      error = { ...error, digitNoMatchErrorMessage };
    }

    if (hasSpecialChar === false) {
      error = { ...error, specialCharNoMatchErrorMessage };
    }

    if (hasMinLength === false) {
      error = { ...error, minLengthErrorMessage };
    }
  }

  return error;
}
