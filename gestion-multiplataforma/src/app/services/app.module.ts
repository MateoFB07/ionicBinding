import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { provideIonicAngular } from '@ionic/angular';

import { AppComponent } from '../app.component';
import { SupabaseService } from './supabase.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
  ],
  declarations: [AppComponent],
  providers: [SupabaseService, provideIonicAngular({ mode: 'ios' })],
  bootstrap: [AppComponent],
})
export class AppModule {}