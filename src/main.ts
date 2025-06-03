import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentFormComponent } from './app/appointment-form/appointment-form.component';
import { AdminComponent } from './app/admin/admin.component';

const routes = [
  { path: '', component: AppointmentFormComponent },
  { path: 'admin', component: AdminComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule, HttpClientModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
