Cli for getting npm versions of all packages in your Bitbacket 
=================

How it works?
-------------------------------------

1. `npm install`

2. Run command `npm run load -- --user {bitbacketUserName} --password {bitbacketPassword} --host {youBitbacketHost}` for loading `package.json` from available repositories.

3. Run command `npm run show`

By default `show` will show only `lodash` versions.

But you can pass dependencies that will be show in result:
`npm run show -- --package=axios --package=lodash`

Show links to the repos
`yarn show -p axios -p lodash -l`

Filter by last commit:

`npm run show -- -d 90` - will apply filter by last 30 days (last commit)
