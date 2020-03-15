import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {OverlayModule} from '@angular/cdk/overlay';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PtMenuTriggerDirective} from './pt-menu-trigger.directive';
import { PtMenuComponent } from './pt-menu/pt-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    PtMenuTriggerDirective,
    PtMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    OverlayModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
