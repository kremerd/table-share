import { AbstractControl } from '@angular/forms';
import { OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const selectFormIfValid = <T, R = unknown> (controlProducer: (p: R) => AbstractControl): OperatorFunction<R, T> =>
  input => input.pipe(
    map(p => controlProducer(p)),
    filter(form => form.valid),
    map(form => form.value as T)
  );

export const fileListToArray = (files: FileList | null | undefined): File[] =>
  Array.from(files ?? []);
