import { IHandler } from './handler';
import { IConfig } from './route-config';

export interface IRoute extends IConfig {
    callbacks: IHandler[];
}
