import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot({ url: environment.wsRoot })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
