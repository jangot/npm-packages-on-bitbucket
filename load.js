const fs = require('fs');
const util = require('util');
const config = require('config');
const commandLineArgs = require('command-line-args');
const rimraf = util.promisify(require('rimraf'));

const loadReposPage = require('./src/util/load-repo-part');
const bitbacket = require('./src/resource/bitbucket');

const optionDefinitions = [
    { name: 'user', type: String, alias: 'u' },
    { name: 'password', type: String, alias: 'p' },
    { name: 'host', type: String, alias: 'h' },
    { name: 'protocol', type: String, default: 'https' },
    { name: 'dataPath', type: String },
    { name: 'pathname', type: String },
];

const args = commandLineArgs(optionDefinitions);

if (!args.host) {
    console.log('--host is required');
    return;
}

const DATA_PATH = args.dataPath || config.dataPath;

bitbacket
    .useAuth(args.user, args.password)
    .useHost(args.host)
    .useProtocol(args.protocol)
    .usePathname(args.pathname);

async function run(page = 0) {
    const list = await loadReposPage(page);
    console.log(`Is last page: ${list.isLastPage}`);
    if (!list.isLastPage) {
        await run(list.nextPageStart);
    }
}

rimraf(DATA_PATH)
    .then(() => {
        console.log('Old data have been removed');

        fs.mkdirSync(DATA_PATH);
        console.log('Folder for data have been created');
        return run();
    })
    .then(() => {
        console.log(`---=== SUCCESS ===---`);
    })
    .catch(e => {
        console.log(`ERROR`);
        console.log(e);
    });
