import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';

const API_URL = 'http://localhost:8000/graphql';


export interface AuthResponseData {
    token: String
} 

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null);

    constructor(private router: Router){}

    signIn = async variables =>
       await axios.post(API_URL, {
        query: `
          mutation ($login: String!, $password: String!) {
            signIn(login: $login, password: $password) {
              token
            }
          }
        `,
        variables,
      }).then((res) => {
        if (res.data.data) {
            const token = res.data.data.signIn.token;
            const decoded = jwt_decode(token);
            const expirationDate = new Date(new Date().getTime() + decoded.exp * 1000);
            const user = new User(decoded.email, decoded.id, token, expirationDate);
            this.user.next(user);
            localStorage.setItem("userData", JSON.stringify(user));
            return this.user;
        } else if (res.data.errors) {
            return res.data.errors[0].message;
        }
      }).catch((error) => {
        console.log('error', error)
      });


      signOut() {
          this.user.next(null);
          localStorage.removeItem("userData");
          this.router.navigate(['/login']);
      }

}