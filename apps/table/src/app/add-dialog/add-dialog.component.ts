import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddTokenModel } from '../add-token-model';
import { verticalDeflation } from '../animations';

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  animations: [verticalDeflation]
})
export class AddDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<AddDialogComponent>,
    private formBuilder: FormBuilder
  ) { }

  tokens: AddTokenModel[] = [
    { image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg', name: 'Jack', amount: 4 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg', name: 'Queen', amount: 4 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg', name: 'King', amount: 4 }
  ];

  form: FormArray;

  ngOnInit(): void {
    this.form = this.buildForm(this.tokens);
  }

  private buildForm(tokens: AddTokenModel[]): FormArray {
    const formGroups = tokens.map(token => this.buildFormGroup(token))
    return this.formBuilder.array(formGroups);
  }

  private buildFormGroup(token: AddTokenModel): FormGroup {
    return this.formBuilder.group({
      image: [token.image],
      name: [token.name],
      amount: [token.amount, [Validators.min(0), Validators.max(16)]]
    });
  }

  removeTokenAt(index: number): void {
    this.form.removeAt(index);
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialog.close();
  }

}
