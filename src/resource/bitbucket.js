const url = require('url');
const config = require('config');
const axios = require('axios');

class Client {
    constructor() {
        if (!Client.auth) {
            throw Error('Auth was not set. Use `Client.useAuth(username, password)`')
        }
        const { api } = config;
        const { auth } = Client;

        if (!Client.host) {
            throw Error ('Host is required');
        }
        api.host = Client.host;
        if (Client.protocol) {
            api.protocol = Client.protocol;
        }
        if (Client.pathname) {
            api.pathname = Client.pathname;
        }

        this.bitbucket = axios.create({
            baseURL: url.format(api),
            timeout: 10000,
            auth
        });
        this.bitbucket
            .interceptors
            .response
            .use(response => response.data, error => Promise.reject(error));
    }
    getProjects(limit, start) {
        return this.bitbucket.get(`/projects?limit=${limit}&start=${start}`);
    }
    getAllRepositories(limit, start) {
        return this.bitbucket.get(`/repos?limit=${limit}&start=${start}`);
    }
    getFile(projectKey, repositorySlug, path) {
        return this.bitbucket.get(`/projects/${projectKey}/repos/${repositorySlug}/raw/${path}`);
    }
    getCommints(project, repo) {
        return this.bitbucket.get(`/projects/${project}/repos/${repo}/commits/?until=master`);
    }
}

Client.useAuth = function(username, password) {
    Client.auth = {
        username,
        password
    };

    return Client;
};
Client.useHost = function(host) {
    Client.host = host;

    return Client;
};
Client.useProtocol = function(protocol) {
    Client.protocol = protocol;

    return Client;
};
Client.usePathname = function(pathname) {
    Client.pathname = pathname;

    return Client;
};

module.exports = Client;
