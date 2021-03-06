import { ChangeDetectionStrategy, Component } from '@angular/core';
import { version } from '../../../../../package.json';

@Component({
  selector: 'ts-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  readonly version: string = version;

}
