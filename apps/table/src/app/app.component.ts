import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '@table-share/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'table-share-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private socket: Socket
  ) {}

  form = new FormGroup({
    message: new FormControl('')
  });

  socketResult$: Observable<Message>;

  ngOnInit(): void {
    this.socket.fromEvent<Message>('message').pipe(
      tap(message => this.form.setValue(message, { emitEvent: false }))
    ).subscribe();

    this.form.valueChanges.pipe(
      tap(message => this.socket.emit('message', message))
    ).subscribe();
  }
}
