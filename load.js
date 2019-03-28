const fs = require('fs');
const util = require('util');
const commandLineArgs = require('command-line-args');
const config = require('config');
const rimraf = util.promisify(require('rimraf'));

const loadReposPage = require('./src/util/load-repo-part');
const bitbacket = require('./src/resource/bitbucket');

const optionDefinitions = [
    { name: 'user', type: String, alias: 'u' },
    { name: 'password', type: String, alias: 'p' },
    { name: 'host', type: String, alias: 'h' },
    { name: 'protocol', type: String },
    { name: 'pathname', type: String },
];


const args = commandLineArgs(optionDefinitions);

if (!args.host) {
    console.log('--host is required');
    return;
}
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
rimraf(config.dataPath)
    .then(() => {
        console.log('Old data have been removed');

        fs.mkdirSync(config.dataPath);
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
