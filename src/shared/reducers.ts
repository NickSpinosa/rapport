import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable }      from '@angular/core';
import { GmailService } from '../shared/gmail.service';
import { BotService } from '../shared/bot.service';
import { Store } from '../shared/store';
import { Router } from '@angular/router';
import {ApiService} from '../shared/api.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class Reducers {


constructor(private apiService: ApiService, private router: Router, private botService: BotService, private store: Store){
  this.dispatch = this.dispatch.bind(this);
}

public dispatch(type,payload){

    //use getValue to unwrap the currentState
    var state = Object.assign({},this.store.state.getValue());
    
    switch(type){
      
      case 'SET-AUTH-RESULT':
        state.user.authResult = payload;
        break;

      case 'SET-USER-INFO':
        state.user.appUserInfo = payload;
        break;

      case 'SET-USER-VARS':
        state.user.token = localStorage.getItem('id_token');
        state.user.token = localStorage.getItem('user_id');
        break;
    
      case 'GET-USER-BOTS': 
        
          //this.decorateAll(this.userBots);
          //this.scheduled = this.joinScheduledTaskDescriptions(this.userBots);
          //this.recent = this.joinRecentTaskDescriptions(this.userBots);
          //this.store.dispatch('SET-USER-BOTS',{userBots: this.userBots});
          // } else {
          //   state.bots.userBots = [];
          //   //state.tasks.scheduled = [];
          // }

        break;
      case 'SET-USER-BOTS':
        state.bots.userBots = payload.userBots;
        break;
      case 'DELETE-TASK': 
        payload.bot.tasks = payload.bot.tasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks.push(payload.task.id);
        if(!payload.task.decorated.subTask){
          payload.bot.decorated.potentialTasks.push(payload.task); 
        }
        break;
      case 'ADD-TASK': 
        payload.bot.tasks.push(payload.task);
        payload.bot.decorated.potentialTasks = payload.bot.decorated.potentialTasks.filter(function(task){
          return task !== payload.task;
        });
        this.botService.deletedTasks = this.botService.deletedTasks.map(function(task){
          return task.id !== payload.task.id;
        })
        break;


      case 'ROUTE':
        var userObj = this.store.state.getValue().user.appUserInfo;
        var userBots = this.store.state.getValue().bots.userBots;
        if(userObj.newUser || userBots.length===0){
          this.router.navigate(['setup']);
        } else {
          this.router.navigate(['manage']);
        }
        break;
      default: 
        alert('unhandled action');
    }
    this.store.state.next(state);
    return this.store.state.asObservable().toPromise();
  }

}