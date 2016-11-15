import { Component } from '@angular/core';
import { Auth } from '../shared/auth.service';

@Component({
  selector: 'my-app',
  styleUrls: ['app/app/app.component.css'],
  providers: [Auth],
  template: `
    <h1>{{title}}</h1>
    <nav>
                <p>This is a change//</p>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
        <a routerLink="/landing-page" routerLinkActive="active">Landing Page</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  
})
export class AppComponent {
  constructor(private auth: Auth) {}

  title = 'Tour of Heroes';
}
