import { AngularIndexedDB } from 'angular2-indexeddb';
import * as _ from 'underscore';
import { Injectable } from '@angular/core';

@Injectable()
export class IndexDbProvider {
    public indexDB: any;
    openDbAndCreateObjectStore(dbName, storeList) {
        let self = this;
        self.indexDB = new AngularIndexedDB(dbName, 1);
        self.indexDB.openDatabase(1, evt => {
        _.each(storeList, (store: any) => {
            let objectStore = evt.currentTarget.result.createObjectStore(
                store.name.first,
                { keyPath: 'id', autoIncrement: true }
                );
                objectStore.createIndex('content', 'content', { unique: false });
                objectStore.createIndex('time', 'time', { unique: true });
                objectStore.createIndex('fromServer', 'fromServer', { unique: false });
            });
        });
    }

    addRecord (store, message) {
        let self = this;
        return self.indexDB.add(store.name.first, {
            content: message.content,
            time: Date.now(),
            fromServer: message.fromServer
        })
        .then(
            () => {
            },
            error => {
                console.log(error);
            }
        );
    }

    getAllRecord(store) {
        let self = this;
        return new Promise((resolve, reject) => {
            return self.indexDB.getAll(store.name.first).then(
                messages => {
                    return resolve(messages);
                },
                error => {
                    let messages = [];
                    return resolve(messages);
                }
            );
        });
    }
}
