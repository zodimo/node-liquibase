import {exec} from 'child_process';

export class CommandHandler {
	public static spawnChildProcess(commandString: string) {
		console.log(`Running ${commandString}...`);
		return new Promise((resolve, reject) => {
			exec(commandString, (error, stdout, stderr) => {
				console.log('\n', stdout);
				if (error) {
					console.error('\n', stderr);
					// error.stderr = stderr;
					return reject(error);
				}
				resolve(stdout);
			});
		});
	}
}
