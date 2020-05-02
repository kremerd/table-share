import { EventEmitter } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export class ManagedFormArray<T> extends FormArray {

  constructor(
    private controlFactory: () => AbstractControl,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super([], validatorOrOpts, asyncValidator);
    this.eventLimiter = this.buildProxy();
  }

  valueChanges: Observable<T[]> = this.valueChanges;

  private eventLimiter: FormArray;
  private emitEvents: boolean = true;

  private buildProxy(): FormArray {
    const proxyValueChanges = new EventEmitter();

    proxyValueChanges.pipe(filter(() => this.emitEvents))
      .subscribe(this.valueChanges as EventEmitter<T[]>);

    return new Proxy(this, {
      get: (obj: FormArray, prop: keyof FormArray) =>
        prop === 'valueChanges' ? proxyValueChanges : obj[prop]
    });
  }

  setValue(value: T[], options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.emitEvents = false;

    while (this.controls.length < value.length) {
      this.push.bind(this.eventLimiter)(this.controlFactory());
    }

    while (this.controls.length > value.length) {
      this.removeAt.bind(this.eventLimiter)(this.controls.length - 1);
    }

    this.emitEvents = true;
    super.setValue(value, options);
  }

}
