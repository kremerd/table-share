import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { generateRandomId, Token } from '@table-share/api-interfaces';
import { verticalDeflation } from '../animations';
import { TokenEssentials, TokenGroup } from './token-group';

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  animations: [verticalDeflation]
})
export class AddDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<AddDialogComponent, Token[] | undefined>,
    private formBuilder: FormBuilder
  ) { }

  private tokenGroups: TokenGroup[] = [
    { image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg', name: 'Jack', amount: 1 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg', name: 'Queen', amount: 2 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg', name: 'King', amount: 3 }
  ];

  form: FormArray;

  ngOnInit(): void {
    this.form = this.buildForm(this.tokenGroups);
  }

  private buildForm(tokens: TokenGroup[]): FormArray {
    const formGroups = tokens.map(token => this.buildFormGroup(token))
    return this.formBuilder.array(formGroups);
  }

  private buildFormGroup(token: TokenGroup): FormGroup {
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

    const tokens = this.generateTokens(this.form.value);
    this.dialog.close(tokens);
  }

  private generateTokens(tokenGroups: TokenGroup[]): Token[] {
    return tokenGroups
      .map(({ name, image, amount }) => Array<TokenEssentials>(amount).fill({ name, image }))
      .flat()
      .map((essentials, i) => ({
        type: 'token',
        id: generateRandomId(),
        x: 30 * i,
        y: 30 * i,
        ...essentials
      }));
  }

}
