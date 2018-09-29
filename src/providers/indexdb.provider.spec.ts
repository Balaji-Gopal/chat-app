import { IndexDbProvider } from './indexdb.provider';
import { Z_DEFAULT_STRATEGY } from 'zlib';
const content = require('../assets/randomuser.json');
import { async } from '@angular/core/testing';

describe('IndexDbProvider', () => {
    let indexDbProvider: IndexDbProvider;

    beforeAll(() => {
        indexDbProvider = new IndexDbProvider();
        indexDbProvider.openDbAndCreateObjectStore('testDb', content.results);
    });

    it('add records to test db and return the value true', function() {
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

    it('get all the records from the store', function() {
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
