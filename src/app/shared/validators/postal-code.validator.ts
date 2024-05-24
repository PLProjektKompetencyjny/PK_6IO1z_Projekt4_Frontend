import { AbstractControl, ValidationErrors } from "@angular/forms";

export const formatRegex: RegExp = /^\d{2}-\d{3}$/;
export const formatNoMatchErrorMessage: string = 'Postal code must be in format XX-XXX with digits only';

export const PostalCodeValidator = function (control: AbstractControl): ValidationErrors | null {
  const postalCode = control.value;
  let error = {};

  if (postalCode) {
    const validFormat = formatRegex.test(postalCode);

    if (validFormat === false) {
      error = { ...error, formatNoMatchErrorMessage };
    }
  }

  return error;
}
