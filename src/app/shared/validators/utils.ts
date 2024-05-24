import { AbstractControl } from "@angular/forms"

/**
 * Retrieves control errors after form validation.
 * @param control A control to check
 * @returns An array of errors in the control.
 */
export const getControlErrors = (control: AbstractControl | null): string[] => {
  const passwordErrors = control?.errors;
  if (!passwordErrors) {
    return [];
  }


  const parsedErrors: string[] = [];
  for (const key in passwordErrors) {
    if (Object.prototype.hasOwnProperty.call(passwordErrors, key) && key !== 'required') {
      parsedErrors.push(passwordErrors[key]);
    }
  }

  return parsedErrors;
} 