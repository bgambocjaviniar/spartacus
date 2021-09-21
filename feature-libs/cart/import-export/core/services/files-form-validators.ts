import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FilesFormValidators {
  /**
   * Checks max size of file
   *
   * @param {number} maxSize Max size [MB]
   * @returns Uses 'tooLarge' validator error with maxSize property
   * @memberof FilesFormValidators
   */
  maxSize(maxSize?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors: ValidationErrors = {};
      if (maxSize) {
        const files: File[] = Array.from(control.value);
        files.forEach((file: File) => {
          if (file.size / 1000000 > maxSize) {
            errors.tooLarge = { maxSize };
          }
        });
      }
      return Object.keys(errors).length === 0 ? null : errors;
    };
  }
}
