![Website](https://img.shields.io/website?color=%233090C7&up_message=liquibase.org&url=https%3A%2F%2Fwww.liquibase.org%2F)
![Website](https://img.shields.io/website?color=%233090C7&label=docs&up_message=docs.liquibase.com&url=https%3A%2F%2Fdocs.liquibase.com%2F)
![Twitter Follow](https://img.shields.io/twitter/follow/liquibase?style=social)
![npm](https://img.shields.io/npm/dt/liquibase?label=total%20downloads)
![npm](https://img.shields.io/npm/dw/liquibase?label=weekly%20downloads)
![GitHub repo size](https://img.shields.io/github/repo-size/liquibase/node-liquibase?logo=GitHub&style=flat-square)

Use Node.js and databases? Want to do smart architecture decisions? Do not invent wheel, use Liquibase.
Liquibase is an open-source database-independent library for tracking, managing and applying database schema changes.

## Installation
There is an easy way to integrate Liquibase power to Node.js application. All you need
is npm package.

`$ npm install --save liquibase`


## Usage
Liquibase support rich pool of commands to keep your database up-to-date, like update, rollback, diff check out full list here: https://docs.liquibase.com/commands/home.html.
### CLI
You can use this NPM package as a CLI tool under the namespace `node-liquibase` if you wish.
#### Example
##### Bundled Liquibase Executable
```bash
node-liquibase
--changeLogFile="/examples/change-log-examples/postgreSQL/changelog.xml"
--url="jdbc:postgresql://localhost:5432/postgres"
--username="yourusername"
--password="yoursecurepassword"
--classpath="/Users/taylor/Dev/Liquibase/hackathons/node-liquibase/drivers/postgresql-42.2.8.jar"
status
```

##### Alternative Liquibase Executable
```bash
node-liquibase /Users/taylor/Dev/Liquibase/hackathons/node-liquibase/bin/liquibase/liquibase
 --changeLogFile="/examples/change-log-examples/postgreSQL/changelog.xml"
 --url="jdbc:postgresql://localhost:5432/postgres"
 --username="yourusername"
 --password="yoursecurepassword"
 --classpath="/Users/taylor/Dev/Liquibase/hackathons/node-liquibase/drivers/postgresql-42.2.8.jar"
 status
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

## Want to help?
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
