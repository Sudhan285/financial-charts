import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
  private url = 'http://localhost:3000';

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  // chat api calls
    //get all chats from database
    getChats() {
      return this.http.get('/chats').map(res => res.json());
    }
    //find chat by id
    findChat(id) {
      return this.http.get(`/chat/${id}`).map(res => res.json());
    }
    //add chat to database
    addChat(chat) {
      return this.http.post("/chat", JSON.stringify(chat), this.options);
    }
    //pushes a new message to an existing chat db entry
    editChat(id, chat) {
      return this.http.put(`/chat/${id}`, JSON.stringify(chat), this.options);
    }
    //deletes chat
    deleteChat(id) {
      return this.http.delete(`/chat/${id}`, this.options);
    }
    //sends an email when agent is offline
    sendComment(comment) {
      return this.http.post("/sendEmail", JSON.stringify(comment), this.options);
    }
    // get agents online status
    getAgent() {
      return this.http.get('/agentStatus').map(res => res.json());
    }
}
