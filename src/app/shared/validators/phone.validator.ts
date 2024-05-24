import { AbstractControl, ValidationErrors } from "@angular/forms";

export const formatRegex: RegExp = /^\+\d{11}$/;
export const formatNoMatchErrorMessage: string = 'Phone must have format "+XXXXXXXXXXX"';

export const PhoneValidator = function (control: AbstractControl): ValidationErrors | null {
  const phone = control.value;
  let error = {};

  if (phone) {
    const validFormat = formatRegex.test(phone);

    if (validFormat === false) {
      error = { ...error, digitsNoMatchErrorMessage: formatNoMatchErrorMessage };
    }
  }

  return error;
}
