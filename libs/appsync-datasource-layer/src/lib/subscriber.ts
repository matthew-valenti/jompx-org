import { EventEmitter } from 'node:events';
import { v4 as uuidv4 } from 'uuid';

export class Subscriber {

    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    public subscribe() {

        this.eventEmitter.on('onInit', (datasourceId: string, event: any, props: any) => {
            console.log(`onInit ${datasourceId}`);
            const uuid = uuidv4();
            console.log('uuid', uuid);
            event.request.headers['x-jompxorg'] = { uuid };
        });

        this.eventEmitter.on('beforeQuery', (datasourceId: string, event: any, props: any) => {
            console.log(`beforeQuery ${datasourceId}, ${event}, ${props}`);
        });

        this.eventEmitter.on('afterQuery', (datasourceId: string, event: any, props: any) => {
            console.log(`afterQuery ${datasourceId}, ${event}, ${props}`);
        });
    }
}