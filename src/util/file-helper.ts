import { join } from 'path';
import * as fs from 'fs';

export class FileHelper {
	public static get bundledLiquibasePath() {
		if (process.env.NODE_ENV === 'test') {
			return this.bundledLiquibasePathForInternalConsumers;
		}

		return this.bundledLiquibasePathForExternalConsumers;
	}

	public static get bundledLiquibasePathForExternalConsumers(): string {
		const liquibaseExecutablePath = join(__dirname, 'liquibase/liquibase');
		return liquibaseExecutablePath;
	}

	public static get bundledLiquibasePathForInternalConsumers(): string {
		const liquibaseExecutablePath = join(__dirname, '../../bin/liquibase/liquibase');
		return liquibaseExecutablePath;
	}

	public static readFileContent(absolutePathToPropertyFile: string): string {
		let fileContent;
		fs.readFile(absolutePathToPropertyFile, 'utf8' , (err, data) => {
			if (err) {
				//TODO: add logging of error or warn message
				return;
			}
			fileContent = data;
		})
		return fileContent;
	}
}
