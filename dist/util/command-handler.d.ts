import { LiquibaseConfig } from '../models';
import { Logger } from '../util';
export declare class CommandHandler {
    logger: Logger;
    constructor(config: LiquibaseConfig);
    spawnChildProcess(commandString: string): Promise<string>;
}
