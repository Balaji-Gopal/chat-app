import { AngularIndexedDB } from 'angular2-indexeddb';
import * as _ from 'underscore';
import { Injectable } from '@angular/core';

@Injectable()
export class IndexDbProvider {
    public indexDB: any;

    /**
     * Function to create database and create stores in index db for the given db and store names
     * @name openDbAndCreateObjectStore
     * @param dbName holds db name
     * @param storeList holds array of object for store names
     */
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
                    objectStore.createIndex('time', 'time', { unique: false });
                    objectStore.createIndex('fromServer', 'fromServer', { unique: false });
                });
        });
    }

    /**
     * Fucntion to add record to the db
     * @name addRecord
     * @param store holds store name
     * @param message holds message to be added as record
     */
    addRecord (store, message) {
        let self = this;
        return self.indexDB.add(store.name.first.trim(), {
            content: message.content,
            time: Date.now(),
            fromServer: message.fromServer
        })
        .then(
            () => {
            },
            error => {
                console.log('Add Record Error::', error);
            }
        );
    }

    /**
     * Function to get all the records from the database for the givens store name
     * @name getAllRecord
     * @param store holds the store name
     */
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
