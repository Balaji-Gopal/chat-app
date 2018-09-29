import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { AngularIndexedDB } from 'angular2-indexeddb';
import * as _ from 'underscore';
import { IndexDbProvider } from '../providers/indexdb.provider';

export class Message {
  constructor(
    public friend: string,
    public content: string,
    public time: number,
    public fromServer: boolean
  ) {}
}

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [IndexDbProvider]
})

export class AppComponent implements OnInit {
  public friends: any = [];
  public findFriend: any;
  public _socket: WebSocketSubject<Message>;
  public messages = new Array<Message>();
  public clientMessage = '';
  public friend = null;
  @ViewChild('scrollArea') public scrollArea: ElementRef;
  constructor(
    public indexDbProvider: IndexDbProvider,
  ) {
    let self = this;
    self.connectSocekt();
  }

  ngOnInit() {
    let self = this;
    const content = require('../assets/randomuser.json');
    self.friends = content.results;
    self.indexDbProvider.openDbAndCreateObjectStore('myChatDb', self.friends);
  }

  connectSocekt() {
    let self = this;
    let webSocketUri = 'wss://echo.websocket.org/';
    self._socket = new WebSocketSubject(webSocketUri);
    self._socket.subscribe(
      (message: Message) => {
        message['fromServer'] = true;
        self.messages.push(message);
        self.indexDbProvider.addRecord(self.friend, message);
      },
      (error: any) => {
        console.error('Error', error);
      },
      () => console.warn('Completed!')
    );
  }

  doSend(): void {
    let self = this;
    let message = new Message(
      self.friend.name.first,
      self.clientMessage,
      Date.now(),
      false
    );
    self.clientMessage = '';
    self.messages.push(message);
    self.scroll();
    self.indexDbProvider.addRecord(self.friend, message);
    self._socket.next(message);
  }

  selectFriend(friend: any) {
    let self = this;
    self.friend = friend;
    self.indexDbProvider.getAllRecord(self.friend).then((messages: Array<Message>) => {
      self.messages = messages;
      self.scroll();
    }, (error) => {
      self.messages = [];
    });
  }

  getDateTime(milliseconds: number) {
    let dateTime = new Date(milliseconds);
    return dateTime.toDateString() + ' ' + dateTime.toLocaleTimeString();
  }

   scroll(): void {
    let self = this;
    setTimeout(() => {
      self.scrollToBottom();
    }, 100);
  }

  getDiff(): number {
    let self = this;
    if (!self.scrollArea) {
      return -1;
    }

    const nativeElement = self.scrollArea.nativeElement;
    return (
      nativeElement.scrollHeight -
      (nativeElement.scrollTop + nativeElement.clientHeight)
    );
  }

  scrollToBottom(t: number = 1, b: number = 0): void {
    let self = this;
    if (b < 1) {
      b = self.getDiff();
    }
    if (b > 0 && t <= 120) {
      setTimeout(() => {
        const diff = self.easeInOutSin(t / 120) * self.getDiff();
        self.scrollArea.nativeElement.scrollTop += diff;
        self.scrollToBottom(++t, b);
      }, 1 / 60);
    }
  }

  easeInOutSin(t: number): number {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }
}
