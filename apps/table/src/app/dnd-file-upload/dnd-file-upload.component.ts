import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { fileListToArray } from '@table-share/util';
import { merge, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, scan, withLatestFrom } from 'rxjs/operators';

interface ComponentModel {
  dragOver: boolean;
  files: File[];
  maxSize: number;
  success?: boolean;
}

@Component({
  selector: 'ts-dnd-file-upload',
  templateUrl: './dnd-file-upload.component.html',
  styleUrls: ['./dnd-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DndFileUploadComponent extends RxState<ComponentModel> {

  @Input()
  set maxSize(maxSize: number) {
    this.set({ maxSize });
  }

  @Output()
  filesSelected = this.select(map(vm => vm.files));

  dragEnter = new Subject<void>();
  dragLeave = new Subject<void>();
  dragOver = new Subject<DragEvent>();
  drop = new Subject<DragEvent>();

  constructor() {
    super();
    this.set({ dragOver: false, files: [], maxSize: 1024 });

    const dragOver$ = merge(
      this.dragEnter.pipe(mapTo(1)),
      this.dragLeave.pipe(mapTo(-1)),
      this.drop.pipe(mapTo(-1))
    ).pipe(
      scan((acc, value) => acc + value, 0),
      map(counter => counter > 0),
      distinctUntilChanged(),
      map(dragOver => ({ dragOver }))
    );

    const dropSuccess$ = this.drop.pipe(
      map(drop => fileListToArray(drop.dataTransfer?.files)),
      withLatestFrom(this.$),
      map(([files, { maxSize }]) => files.every(file => file.size < maxSize)),
      map(success => ({ success }))
    );

    const successfullDrop$ = this.drop.pipe(
      map(drop => fileListToArray(drop.dataTransfer?.files)),
      withLatestFrom(this.$),
      filter(([files, { maxSize }]) => files.every(file => file.size < maxSize)),
      map(([newFiles, { files }]) => ({ files: [...files, ...newFiles] }))
    );

    this.connect(dragOver$);
    this.connect(dropSuccess$);
    this.connect(successfullDrop$);

    this.hold(merge(this.dragOver, this.drop), event => event.preventDefault());
  }

}
