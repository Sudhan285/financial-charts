import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService }       from '../services/chat.service';
import { AlertComponent } from '../shared/alert/alert.component';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css'],
  providers: [ChatService, AuthService]
})
export class AgentComponent implements OnInit, OnDestroy {

  constructor(private chatService:ChatService,
              private alert: AlertComponent,
              private auth: AuthService) {}
  ngOnInit(){}
  ngOnDestroy(){}
}
