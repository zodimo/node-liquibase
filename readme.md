> Node.js wrapper for Liquibase


## Install

```
$ npm install --save liquibase
```


## Usage
### CLI
You can use this NPM package as a CLI tool under the namespace `node-liquibase` if you wish.
#### Example
##### Bundled Liquibase Executable
```bash
node-liquibase --changeLogFile="/examples/change-log-examples/postgreSQL/changelog.xml" --url="jdbc:postgresql://localhost:5432/postgres" --username="yourusername" --password="yoursecurepassword" --classpath="/Users/taylor/Dev/Liquibase/hackathons/node-liquibase/drivers/postgresql-42.2.8.jar" status
```

##### Alternative Liquibase Executable
```bash
node-liquibase /Users/taylor/Dev/Liquibase/hackathons/node-liquibase/bin/liquibase/liquibase --changeLogFile="/examples/change-log-examples/postgreSQL/changelog.xml" --url="jdbc:postgresql://localhost:5432/postgres" --username="yourusername" --password="yoursecurepassword" --classpath="/Users/taylor/Dev/Liquibase/hackathons/node-liquibase/drivers/postgresql-42.2.8.jar" status
```

### In Your Project Files
#### TypeScript
```typescript
import { LiquibaseConfig, Liquibase, POSTGRESQL_DEFAULT_CONFIG } from 'node-liquibase'

const myConfig: LiquibaseConfig = {
	...POSTGRESQL_DEFAULT_CONFIG,
	url: 'jdbc:postgresql://localhost:5432/node_liquibase_testing',
	username: 'yourusername',
	password: 'yoursecurepassword',
}
const instance = new Liquibase(myConfig);

async function doEet() {
	await instance.status();
	// await instance.update();
	// await instance.dropAll();
}

doEet();
```

#### JavaScript
From the index.js file adjust "<>" fields accordingly:
```js
const fromLibrary = require('node-liquibase/cjs/index');
const POSTGRESQL_DEFAULT_CONFIG = require('node-liquibase/cjs/constants/defaults/postgresql-default.config').POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
	changeLogFile: POSTGRESQL_DEFAULT_CONFIG.changeLogFile,
	classpath: POSTGRESQL_DEFAULT_CONFIG.classpath,
	url: 'jdbc:postgresql://localhost:5432/node_liquibase_testing',
	username: 'yourusername',
	password: 'yoursecurepassword',
}

const instance = new fromLibrary.Liquibase(myConfig);

doEet();


async function doEet() {
	await instance.status();
	// await instance.update();
	// await instance.dropAll();
}
```

## Development
This project needs some work on the infrastructure and build tooling side. For now the workflow to test an 'end user ready' version of the project, you'll first need to build/compile the code, and then you can run it using the Node CLI's REPL `node path/to/something.js`.

There is an issue in path resolution within THIS application code in addition to the complexities in Liquibase Core. Until this is resolved the resolved path for the Liquibase executable will differ between compiled and source code. **This will affect your experience if you try to transpile the code on the fly using `ts-node`.** I have not resolved the issue yet.

### Build
To build all of the things:
```bash
yarn build
```

### Tests
Run tests with:
```bash
yarn test
```
### Env Vars
To substitute your own user/pass for a given environment, make a copy of `.env.example` in root directory as `.env` and update accordingly.
