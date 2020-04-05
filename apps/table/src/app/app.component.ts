import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '@table-share/api-interfaces';
import { interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'table-share-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  form = new FormGroup({
    message: new FormControl('')
  });

  ngOnInit(): void {
    interval(500).pipe(
      switchMap(() => this.http.get<Message>('/api/message')),
      tap(message => this.form.setValue(message))
    ).subscribe();

    this.form.valueChanges.pipe(
      switchMap(value => this.http.put<void>('/api/message', value))
    ).subscribe();
  }
}
