import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { HorsesComponent } from './horses/horses.component';
import { AddHorseComponent } from './horses/add-horse.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './races/race.component';
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
    path: 'login',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
