import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './auth/auth.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'National Hunt Application';
  isAuthenticated = false
  private userSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoSignIn();
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogOut() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
