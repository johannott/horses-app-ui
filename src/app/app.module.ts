import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { TracksComponent } from './tracks/tracks.component';

import { TrendsComponent } from './trends/trends.component';
import { NotesComponent } from './notes/notes.component';

import { BettingComponent } from './betting/betting.component';
import { BetsComponent } from './betting/bets.component';
import { AccountsComponent } from './betting/accounts.component';

import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';

import { FooterComponent } from './footer/footer.component';

import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component'


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
    TracksComponent,
    TrendsComponent,
    NotesComponent,
    BettingComponent,
    BetsComponent,
    AccountsComponent,
    HomeComponent,
    AuthComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
