import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const login = form.value.email;
    const password = form.value.password;

    const authPromise =  await this.authService.signIn({login, password}); 

    if (typeof authPromise === 'string') {
      this.error = authPromise;
    } else {
      this.router.navigate(['/horses']);
    }
  
    form.reset();
  } 
}