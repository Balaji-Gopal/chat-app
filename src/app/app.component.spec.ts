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
  /**
   * beafore each test case load the required components to the test bed
   */
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

  /**
   * Test case to search the friend
   */
  it('search for friend', () => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('myChatDb', content.results);
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance;
    app.findFriend = 'oka';
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toBe('Okan Ilicali');
  });

  /**
   * Test case to select the friend
   */
  it('select a freind', () => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('myChatDb', content.results);
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance;
    app.selectFriend(content.results[0]);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(app.friend).toBe(content.results[0]);
  });

  /**
   * Test case to post a message to friend
   */
  it('post a message and should render sent message in p tag', () => {
    let indexDbProvider: IndexDbProvider;
    indexDbProvider = new IndexDbProvider();
    indexDbProvider.openDbAndCreateObjectStore('myChatDb', content.results);
    setTimeout(() => {
      let fixture = TestBed.createComponent(AppComponent);
      let app = fixture.componentInstance;
      app.selectFriend(content.results[0]);
      app.clientMessage = 'Test send message';
      app.indexDbProvider = indexDbProvider;
      app.doSend();
        setTimeout(() => {
          fixture.detectChanges();
          let compiled = fixture.debugElement.nativeElement;
          expect(compiled.querySelector('p').textContent).toContain('Test send message');
        }, 2000);
    }, 2000);
  });

});
