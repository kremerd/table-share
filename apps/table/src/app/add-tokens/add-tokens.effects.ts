import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TokenEssentials } from '@table-share/api-interfaces';
import { getEffectiveFilename } from '@table-share/util';
import { map, mergeMap } from 'rxjs/operators';
import { addTokenEssentials, addTokenImages } from './add-tokens.actions';

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
