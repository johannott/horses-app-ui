import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service'; 
import { Subscription } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular'
import { RACES_QUERY } from './graphql'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'National Hunt Application';
  isAuthenticated = false
  private userSub: Subscription;
  private query: QueryRef<any>
  races: any

  constructor(private authService: AuthService, private router: Router, private apollo: Apollo) {}

  ngOnInit() {
    this.authService.autoSignIn();
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });

    this.query = this.apollo.watchQuery({
      query: RACES_QUERY
    })

    this.query.valueChanges.subscribe(result => {
      this.races = result.data && result.data.races;
    })
  }

  onLogOut() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
