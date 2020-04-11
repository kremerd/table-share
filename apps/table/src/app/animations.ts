import { animate, style, transition, trigger } from '@angular/animations';

export const verticalDeflation = trigger('verticalDeflation', [
  transition(':leave', [
    style({ height: '*', opacity: 1 }),
    animate('300ms ease-in-out', style({ height: 0, opacity: 0 }))
  ])
]);
