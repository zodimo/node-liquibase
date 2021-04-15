import { LIQUIBASE_LABEL } from '../constants';


export class Logger {
	constructor() {}

	public static log(message: string): void {
		console.log(`${ LIQUIBASE_LABEL } ${ message }`);
	}

	public static warn(message: string): void {
		console.warn('\x1b[33m%s\x1b[0m', `${ LIQUIBASE_LABEL } ${ message }`);
	}

	public static error(message: string): void {
		console.error('\x1b[31m%s\x1b[0m', `${ LIQUIBASE_LABEL } ${ message }`);
	}
}
