let environment = {};

environment.development = {
    envName : 'development',
    port : 3000
}

environment.production = {
    envName : 'production',
    port : 5000
}

let specified_environment = typeof(process.env.ENV_NAME) == 'string'? process.env.ENV_NAME : 'default';
let selected_environment = typeof(environment[specified_environment]) == 'object'? environment[specified_environment] : environment['development'];

module.exports = selected_environment;

