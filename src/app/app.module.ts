import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RadialProgressModule } from './radial-progress/radial-progress.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RadialProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
