let environment = {};

environment.development = {
    envName : 'development',
    httpPort : 3000,
    httpsPort: 3001,
}

environment.production = {
    envName : 'production',
    httpPort : 5000,
    httpsPort: 5001,
}

let specified_environment = typeof(process.env.ENV_NAME) == 'string'? process.env.ENV_NAME : 'default';
let selected_environment = typeof(environment[specified_environment]) == 'object'? environment[specified_environment] : environment['development'];

module.exports = selected_environment;

