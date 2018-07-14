const net = require('net');
const path = require('path');
const container = require('./http_container.js');
const fs = require('fs');
const PORT = 8124;
net.createServer(function (socket) {
    console.log('connected');
    socket.on('data', function (data) {
        const httpRequestContainer = new container.HttpRequestContainer(data);
        const httpResponseContainer = new container.HttpResponseContainer();
        if (httpRequestContainer.methodType.trim() !== 'GET') {
            httpResponseContainer.statusCode = 405;
            socket.write(httpResponseContainer.toString());
            socket.end();
        } else {
            let filePath = process.cwd() + httpRequestContainer.url;
            let readStream = fs.createReadStream(filePath);
            readStream.on('data', function (chunk) {
                    if (socket.bytesWritten === 0) {
                        let contentType = container.mimeTypes.get(path.extname(httpRequestContainer.url));
                        if(contentType === undefined){
                            return readStream.emit('error');
                        }
                        httpResponseContainer.statusCode = 200;
                        httpResponseContainer.contentType = contentType;
                        httpResponseContainer.contentLength = fs.statSync(filePath).size;
                        socket.write(httpResponseContainer.toString());
                    }
                    if(socket.destroyed) {
                       return readStream.emit('end');
                    }
                    socket.write(chunk);
                }
            );
            readStream.on('error', function () {
                httpResponseContainer.statusCode = 404;
                socket.write(httpResponseContainer.toString());
                socket.end();
            });
            readStream.on('end', function () {
                socket.end();
            })
        }
    })
    ;
    socket.on('close', function () {
        console.log('client closed connection');
    });

    socket.on('error', function (err) {
        console.log(err);
    });
    socket.setTimeout(3000);
    socket.on('timeout', function () {
        socket.end();
    });
}).listen(PORT);



