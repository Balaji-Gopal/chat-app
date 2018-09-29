import { TestBed, async } from '@angular/core/testing';
import { AppComponent, Message } from './app.component';
import {} from 'jasmine';
import { IndexDbProvider } from '../providers/indexdb.provider';
import { ToastrService } from 'ngx-toastr';
const content = require('../assets/randomuser.json');
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';

describe('AppComponent', () => {
  let appComponent: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        AppComponent,
        FilterPipe
      ],
      providers: [
        IndexDbProvider
      ]
    }).compileComponents();
  }));

  it('search for friend', async(() => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('testDb', content.results);
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance;
    app.findFriend = 'oka';
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toBe('Okan Ilicali');
  }));

  it('select a freind', async(() => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('testDb', content.results);
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance;
    app.selectFriend(content.results[0]);
    expect(app.friend).toBe(content.results[0]);
  }));

  it('post a message and should render sent message in p tag', async(() => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('testDb', content.results);
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance;
    app.selectFriend(content.results[0]);
    app.clientMessage = 'Test send message';
    let message = new Message(
      app.friend.name.first,
      app.clientMessage,
      Date.now(),
      false
    );
    app.indexDbProvider = indexDbProvider;
    app.doSend();
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Test send message');
  }));

});
