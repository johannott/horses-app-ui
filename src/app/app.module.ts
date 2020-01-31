import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HorsesComponent } from './horses/horses.component';
import { AddHorseComponent } from './horses/add-horse.component';
import { UpdateHorseComponent } from './horses/update-horse.component';

import { NgbdSortableHeader } from './horses/sortable.directive';

import { RacesComponent } from './races/races.component';
import { RaceComponent } from './races/race.component';

import { EntriesComponent } from './entries/entries.component';
import { AddEntryComponent } from './entries/add-entry.component';
import { UpdateEntryComponent } from './entries/update-entry.component';

import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';


@NgModule({
  declarations: [
    AppComponent,
    HorsesComponent,
    AddHorseComponent,
    UpdateHorseComponent,
    NgbdSortableHeader,
    RacesComponent,
    RaceComponent,
    EntriesComponent,
    UpdateEntryComponent,
    AddEntryComponent,
    HomeComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
