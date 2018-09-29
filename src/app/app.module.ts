import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {FilterPipe} from '../pipes/filter.pipe';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { IndexDbProvider } from '../providers/indexdb.provider';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    ToastrModule.forRoot()
  ],
  providers: [IndexDbProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
