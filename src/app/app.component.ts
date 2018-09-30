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
import { ConnectionService } from 'ng-connection-service';

/**
 * The Message Class which holds the message that is used to push to websocket and indexdb
*/
export class Message {
  constructor(
    public friend: string,
    public content: string,
    public time: number,
    public fromServer: boolean
  ) {}
}

/**
 * declared varibale require to access the local json file for list of users;
 */
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
  public friend: any = null;
  public status = 'ONLINE';
  public isConnected = true;
  public disableSend = false;
  @ViewChild('scrollArea') public scrollArea: ElementRef;
  constructor(
    public indexDbProvider: IndexDbProvider,
    public connectionService: ConnectionService
  ) {
    let self = this;
    self.checkForConnection();
    self.connectSocekt();
  }

  /**
   * On component load perform few operations like loading friends and creating the local db
   * @name ngOnInit
   */
  ngOnInit() {
    let self = this;
    const content = require('../assets/randomuser.json');
    self.friends = content.results;
    self.indexDbProvider.openDbAndCreateObjectStore('myChatDb', self.friends);
  }

  /**
   * Fucntion to monitor user conection offline or online and subsrcibe webscoket if online
   * @name checkForConnection
   */
  checkForConnection() {
    let self = this;
    self.connectionService.monitor().subscribe(isConnected => {
      self.isConnected = isConnected;
      if (self.isConnected) {
        self.status = 'ONLINE';
        self.disableSend = false;
        self.connectSocekt();
      } else {
        self.status = 'OFFLINE';
        self.disableSend = true;
      }
    });
  }

  /**
   * Function to connect the websocket and subscribe for incoming message.
   * @name connectSocket
   */
  connectSocekt() {
    let self = this;
    console.log('invoked');
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

  /**
   * Function to send the message and invoke the add record function to store message to db
   * @name doSend
   */
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

  /**
   * Funtion to select freind and load all the convesation made by him/her
   * @name selectFriend
   * @param friend
   */
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

  /**
   * Function to get the human readble date time from timestamp miliseconds
   * @name getDateTime
   * @param milliseconds
   */
  getDateTime(milliseconds: number) {
    let dateTime = new Date(milliseconds);
    return dateTime.toDateString() + ' ' + dateTime.toLocaleTimeString();
  }

  /**
   * Function to sroll the page on message delivers or recieved
   * @name scroll
   */
  scroll(): void {
    let self = this;
    setTimeout(() => {
      self.scrollToBottom();
    }, 100);
  }

  /**
   * Function to get the difference from the current postion and its actual height
   * @name getDiff
   */
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

  /**
   * Function which scrolls the layout to exact postion which is required
   * @name scrollToBottom
   * @param t holds the transition value
   * @param b holds the difference value
   */
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

  /**
   * Function which calculates the transition
   * @name easeInOutSin
   * @param t holds the transition value
   */
  easeInOutSin(t: number): number {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }
}
