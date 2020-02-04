import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { HorsesComponent } from './horses/horses.component';
import { AddHorseComponent } from './horses/add-horse.component';
import { UpdateHorseComponent } from './horses/update-horse.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './races/race.component';
import { AddEntryComponent } from './entries/add-entry.component';
import { UpdateEntryComponent } from './entries/update-entry.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'horses',
    canActivate: [AuthGuard],
    component: HorsesComponent
  },
  {
    path: 'addhorse',
    canActivate: [AuthGuard],
    component: AddHorseComponent
  },
  {
    path: 'updatehorse/:horse_name',
    canActivate: [AuthGuard],
    component: UpdateHorseComponent
  },
  {
    path: 'races',
    canActivate: [AuthGuard],
    component: RacesComponent
  },
  {
    path: 'races/:race_name',
    canActivate: [AuthGuard],
    component: RaceComponent
  },
  {
    path: 'addentry/:race_name',
    canActivate: [AuthGuard],
    component: AddEntryComponent
  },
  {
    path: 'updateentry/:race_name/:horse_name',
    canActivate: [AuthGuard],
    component: UpdateEntryComponent
  },
  {
    path: 'login',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
