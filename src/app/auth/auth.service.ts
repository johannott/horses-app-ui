import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';

// const API_URL = 'http://localhost:8000/graphql';
const API_URL = 'https://johann-horses-app.herokuapp.com/graphql'; // <-- add the URL of the GraphQL server here



export interface AuthResponseData {
    token: String
} 

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

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
            const expirationDate = new Date(decoded.exp * 1000);
            const user = new User(decoded.email, decoded.id, token, expirationDate);
            this.user.next(user);
            const expirationDuration = new Date(expirationDate).getTime() - new Date().getTime();
            this.autoSignOut(expirationDuration)
            localStorage.setItem("userData", JSON.stringify(user));
        } else if (res.data.errors) {
            return res.data.errors[0].message;
        }
      }).catch((error) => {
        console.log('error', error)
      });


      autoSignIn() {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return;
        }
    
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
    
        if (loadedUser.token) {
          this.user.next(loadedUser);
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.autoSignOut(expirationDuration);
        }
      }

      autoSignOut(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.signOut();
        }, expirationDuration);
      }


      signOut() {
          this.user.next(null);
          localStorage.removeItem("userData");
          this.router.navigate(['/login']);
          if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
          }
          this.tokenExpirationTimer = null;
      }

}