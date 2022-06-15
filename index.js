
//Dependencies
const config = require("./configuration");
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

//
const decoder = new StringDecoder('utf-8');
let payload = ''; //payload variable

//instantiate http server
const httpServer = http.createServer((request, response) => {
    unifiedSever(request, response);
});

let credentials = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem"),
}

//instantiate https server
const httpsServer = https.createServer(credentials, (request, response) => {
    unifiedSever(request, response);
})

const unifiedSever = (request, response) => {
        //store payload
        request.on('data', (data) => {
            payload += decoder.write(data); //decode payload stream;
        })
    
        request.on('end', () => {
            payload += decoder.end(); //close payload
    
            //store request data
            let data = {
                path: url.parse(request.url, true).pathname.replace(/^\/+|\/+$/g, '') == ''? 'root' : url.parse(request.url, true).pathname.replace(/^\/+|\/+$/g, ''),
                query: url.parse(request.url, true).query,
                header: request.headers,
                method: request.method,
                payload: JSON.stringify(payload),
                
            }
    
            //route request
            let selectedHandler = typeof(router[data.path]) != 'undefined' ? router[data.path] : router['notfound'];
    
            //call the selected hadler
            selectedHandler(data, (status, payload) => {
                response.setHeader('Content-Type', 'application/json');
                response.writeHeader(status);
                response.end(JSON.stringify(payload));
                console.log(`Response: ${status} ${JSON.stringify(payload)} path: ${data.path}`);
            })
        })
}

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
    'root': handler.root
};

httpServer.listen(config.httpPort, () => {
    console.log(`server is listening on port ${config.httpPort} in ${config.envName}`);
})

httpsServer.listen(config.httpsPort, () => {
    console.log(`server is listening on port ${config.httpsPort} in ${config.envName}`);
})