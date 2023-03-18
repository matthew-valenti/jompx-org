import { EventEmitter } from 'node:events';
import { v4 as uuidv4 } from 'uuid';

export class Subscriber {

    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    public subscribe() {
        console.log('subscribe');
        this.eventEmitter.on('event', () => {
            console.log('Awesome! on event fired!');
            const uuid = uuidv4();
            console.log('uuid', uuid);
        });
    }

    public log() {
        console.log('log');
    }
}