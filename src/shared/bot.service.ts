import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { customBot, gmailContact } from '../shared/custom-type-classes';
//import { BOTS } from '../data/mock-bots';

@Injectable()
export class BotService {
  
  //bots: Array<customBot>;
  public userBots: Array<customBot>;
  public botTypes: Array<customBot>;

  public contacts: Array<gmailContact>;
  public tasks: Array<string>;
   
  constructor(private http: Http) {}

  public getBots(){
    //add get tasks when api endpoint is implemented
    return Promise.all([this.getBotTypes(), this.importUserBots()]);
  }

  public getBotTypes(){
    let token = localStorage.getItem('id_token');
    let id = localStorage.getItem('user_id');

    return this.http.get(`/api/botTypes`)
      .map(function(data: any) {
          this.botTypes = JSON.parse(data._body).bots;
          return this.botTypes;
      }).toPromise();
  }

  public getTasks() {
    let userId = localStorage.getItem('user_id');

    this.http.get(`/api/tasks?userId=${userId}`)
      .map((data: any) => {
        data = data.json();
        this.contacts = data;
        return data;
      }).toPromise();
  }

  public importUserBots(){
    let token = localStorage.getItem('id_token');
    let userId = localStorage.getItem('user_id');
    var self = this;

    return this.http.get(`/api/bots?userId=${userId}`) 
      .map(function(data: any) {
        var bots = JSON.parse(data._body);
        if(bots.length !== 0) {
          self.userBots = bots;
          return self.userBots; 
        } else {
          self.userBots = [];
        }
      }).toPromise();
  }

  public getUserBots(){
    return this.userBots || [];
  }

  public retireBot(selectedBot){
    this.userBots = this.userBots.filter((bot)=> bot.id !== selectedBot.id);
    return this.updateBots(this.userBots)
  }

  public returnContacts(){
    return this.contacts || [];
  }

  public addBotTypeToUser(bot: any){
    this.userBots.push(bot);
  }

  public updateBots(userBotsArray){
   const userId = localStorage.getItem('user_id');
   const body = JSON.stringify({bots: userBotsArray});
   const headers = new Headers({'Content-Type': 'application/json'});

   return this.http.put(`/api/bots?userId=${userId}`, body, {headers: headers})
      .toPromise()
      .then(this.importUserBots);
  }

  public sendNow(){
    return this.http.get('/api/runalltasks').toPromise();
  }

}

