
//Dependencies
const config = require("./configuration");
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//
const decoder = new StringDecoder('utf-8');
const payload = ''; //payload variable

//server
const server = http.createServer((request, response) => {
    //store payload
    request.on('data', (data) => {
        payload += decoder.write(data); //decode payload stream;
    })

    request.on('end', () => {
        payload += decoder.end(); //close payload

        //store request data
        let data = {
            path: url.parse(request.url, true).pathname.replace(/^\/+|\/+$/, ''),
            query: url.parse(request.url, true).query,
            header: request.headers,
            method: request.method,
            payload: JSON.stringify(payload),
            
        }

        //route request
        let selectedHandler = typeof(router[data.path]) == 'object' ? router[data.path] : router['notfound'];

        //call the selected hadler
        selectedHandler(data, (status, payload) => {
            response.setHeader('Content-Type: application/json');
            response.writeHeader(status);
            response.end(data.payload);
            console.log(`Response: ${status} ${data.payload}`);
        })
    })
});

let handler = {};

handler.notfound = (data, callback) => {
    //perform handler logic

    //execute callback
    callback(404, {position: 'notfound'});
}

handler.root = (data, callback) => {
    //perform handler logic

    //execute callback
    callback(200, {position: 'root'});
}

let router = {
    'notfound': handler.notfound,
    '/': handler.root
};

server.listen(config.port, () => {
    console.log(`server is listening on port ${config.port} in ${config.envName}`);
})