import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BoardItem } from '@table-share/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'table-share-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private socket: Socket
  ) {}

  form = new FormArray([
    new FormGroup({
      type: new FormControl('EMPTY'),
      x: new FormControl(0),
      y: new FormControl(0)
    })
  ]);

  ngOnInit(): void {
    this.socket.fromEvent<BoardItem[]>('boardItems').pipe(
      tap(items => this.form.setValue(items, { emitEvent: false }))
    ).subscribe();

    this.form.valueChanges.pipe(
      tap(items => this.socket.emit('updateBoardItems', items))
    ).subscribe();

    this.socket.emit('getBoardItems');
  }
}
