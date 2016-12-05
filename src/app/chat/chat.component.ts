import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService }       from '../services/chat.service';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {

  private addCommentForm: FormGroup;
  private name = new FormControl("", Validators.required);
  private email = new FormControl("", Validators.required);
  private comment = new FormControl("", Validators.required);

  constructor(private chatService:ChatService,
              private formBuilder: FormBuilder,
              private alert: AlertComponent) {}
  ngOnInit(){}
  ngOnDestroy(){}
}
