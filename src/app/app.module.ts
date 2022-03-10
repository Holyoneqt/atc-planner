import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { UiModule } from './ui/ui.module';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    DialogsModule,
    OverlayModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => {
      const database = getDatabase();
      return database;
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
