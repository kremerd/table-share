import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Token, TokenEssentials } from '@table-share/api-interfaces';
import { generateRandomId, getEffectiveFilename } from '@table-share/util';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { createBoardItem } from '../board-items/board-items.actions';
import { addTokenEssentials, addTokenImages, addTokens } from './add-tokens.actions';

@Injectable()
export class AddTokensEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) { }

  addTokenImages$ = createEffect(() => this.actions$.pipe(
    ofType(addTokenImages),
    mergeMap(({ images }) => this.http.post<number[]>('/api/files', this.buildFormData(images)).pipe(
      map(fileIds => addTokenEssentials({ tokenEssentials: this.buildTokenEssentials(fileIds, images) }))
    ))
  ));

  createTokens$ = createEffect(() => this.actions$.pipe(
    ofType(addTokens),
    map(({ scale, tokenGroups }) => tokenGroups
      .map(({ name, image, amount }) => Array<TokenEssentials>(amount).fill({ name, image }))
      .flat()
      .map((essentials, i): Token => ({
        type: 'token',
        scale,
        id: generateRandomId(),
        x: 30 * i,
        y: 30 * i,
        ...essentials
      }))
      .map(token => createBoardItem({ boardItem: token }))
    ),
    mergeMap(actions => from(actions))
  ));

  private buildFormData(images: File[]): FormData {
    return images.reduce((formData, image) => {
      formData.append('files', image);
      return formData;
    }, new FormData());
  }

  private buildTokenEssentials(imageIds: number[], images: File[]): TokenEssentials[] {
    return imageIds.map((fileId, idx) => ({
      image: `/api/files/${fileId}`,
      name: getEffectiveFilename(images[idx].name)
    }));
  }

}
