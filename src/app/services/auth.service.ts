import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { DataService } from './data.service';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  //my auth0 credentials, replace these with your own
  clientId = 'qymLfKiEP0M1bPMXchIR5Dbe0wrDH2yk';
  domain = 'sschapma.auth0.com';
  //auth0 options (adjust these to suit your needs)
  options = {
    closable:false,
    allowForgotPassword: false
  };
  // We'll use the Auth0 Lock widget for capturing user credentials
  lock = new Auth0Lock(this.clientId, this.domain, this.options);

  constructor(private router: Router, private data: DataService) {
    // We'll listen for an authentication event to be raised and if successful will log the user in.
    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.lock.getProfile(authResult.idToken, (error: any, profile: any) => {
        if (error) {
          console.log(error);
        }
        localStorage.setItem('profile', JSON.stringify(profile));
      });
      this.lock.hide();
    });
  }

  // This method will display the lock widget
  login() {
    this.lock.show();
  }

  // This method will log the use out
  logout() {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');

    // Send the user back to the home page after logout
    this.router.navigateByUrl('/');
    this.loggedIn();
    this.login();
  }

  // Finally, this method will check to see if the user is logged in. We'll be able to tell by
  // checking to see if they have a token and whether that token is valid or not.
  loggedIn() {
    return tokenNotExpired();
  }
}
