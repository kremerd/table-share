import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { AddTokensEffects } from './add-tokens/add-tokens.effects';
import { addTokensReducer } from './add-tokens/add-tokens.reducer';
import { AppComponent } from './app.component';
import { BoardItemsEffects } from './board-items/board-items.effects';
import { boardItemsReducer } from './board-items/board-items.reducer';
import { DndFileUploadComponent } from './dnd-file-upload/dnd-file-upload.component';
import { FileSizePipe } from './file-size.pipe';
import { TokenGroupConfigurationComponent } from './token-group-configuration/token-group-configuration.component';
import { TokenUploadComponent } from './token-upload/token-upload.component';
import { TokenComponent } from './token/token.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    AddDialogComponent,
    AppComponent,
    DndFileUploadComponent,
    FileSizePipe,
    TokenComponent,
    ToolbarComponent,
    TokenGroupConfigurationComponent,
    TokenUploadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    EffectsModule.forRoot([
      AddTokensEffects,
      BoardItemsEffects
    ]),
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveComponentModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot({ url: environment.wsRoot }),
    StoreModule.forRoot({
      addTokens: addTokensReducer,
      boardItems: boardItemsReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
