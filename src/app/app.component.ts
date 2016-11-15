import { Component } from '@angular/core';
import { Auth } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-app',
  styleUrls: ['app/app/app.component.css'],
  providers: [Auth],
  template: `
    <h1>{{title}}</h1>
    <nav>
        <a routerLink="/setup" routerLinkActive="active">Choose A Bot</a>
        <a routerLink="/manage" routerLinkActive="active">Manage Bots</a>
        <a class="right" (click)="authAct()">{{authAction}}</a>

    </nav>
    <router-outlet></router-outlet>
  `,
  
})
export class AppComponent {
  constructor(private auth: Auth,private router: Router) {
    if(!auth.authenticated()){
      this.authAction = 'Login';
    } else {
      this.authAction = 'Logout';
    }
  }

  authAction = "Login";
  title = 'Tour of Heroes';

  authAct(){
    if(!this.auth.authenticated()){
      this.auth.login();
    } else {
      this.auth.logout();
      this.router.navigate(['']);
    }
  }
}
