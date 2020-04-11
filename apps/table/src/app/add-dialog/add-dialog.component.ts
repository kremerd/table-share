import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { AddTokenModel } from '../add-token-model';

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {

  constructor() { }

  tokens: AddTokenModel[] = [
    { image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg', name: 'Jack', amount: 4 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg', name: 'Queen', amount: 4 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg', name: 'King', amount: 4 }
  ];

  form = new FormArray([
    new FormGroup({
      image: new FormControl(),
      name: new FormControl(),
      amount: new FormControl()
    }),
    new FormGroup({
      image: new FormControl(),
      name: new FormControl(),
      amount: new FormControl()
    }),
    new FormGroup({
      image: new FormControl(),
      name: new FormControl(),
      amount: new FormControl()
    })
  ]);

  formEntries: Subject<AbstractControl[]> = new ReplaySubject(1);

  columnsToDisplay = ['image', 'name', 'amount', 'actions'];

  ngOnInit(): void {
    this.form.setValue(this.tokens);
    this.formEntries.next(this.form.controls);
  }

  removeTokenAt(index: number): void {
    this.form.removeAt(index);
    this.formEntries.next(this.form.controls);
  }

}
