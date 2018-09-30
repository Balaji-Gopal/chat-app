import { IndexDbProvider } from './indexdb.provider';
import { Z_DEFAULT_STRATEGY } from 'zlib';
const content = require('../assets/randomuser.json');
import { AngularIndexedDB } from 'angular2-indexeddb';
import * as _ from 'underscore';

describe('IndexDbProvider', () => {
    let indexDbProvider: IndexDbProvider;
    /**
     * before execution of all test cases initialte the db
     */
    beforeAll(() => {
        indexDbProvider = new IndexDbProvider();
        indexDbProvider.openDbAndCreateObjectStore('myChatDb', content.results);
    });

    /**
     * Test case to add the records to the db
     */
    it('add records to test db and return the value true', () => {
        let store = {
            name: {
                title: 'Mr',
                first: 'Okan',
                last: 'Ilicali'
            }
        };
        let message = {
            content: 'Test Content',
            fromServer: false
        };
        expect(indexDbProvider.addRecord(store, message)).toBeTruthy();
    });

    /**
     * Test case to get all valid records from the db for the given store name
     */
    it('get all the records from the store', () => {
        let store = {
            name: {
                title: 'Mr',
                first: 'Okan',
                last: 'Ilicali'
            }
        };
        expect(indexDbProvider.getAllRecord(store)).toBeTruthy();
    });
});
