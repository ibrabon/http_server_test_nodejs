const httpCodeMessages = new Map([
    [200, 'OK'],
    [404, 'not found'],
    [405, 'method not allowed']
]);

const mimeTypes = new Map([
    ['.aac', 'audio/aac'],
    ['.avi', 'video/x-msvideo'],
    // ['.bmp', 'image/bmp'],
    ['.css', 'text/css'],
    ['.csv', 'text/csv'],
    ['.doc', 'application/msword'],
    ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['.gif', 'image/gif'],
    ['.html', 'text/html'],
    ['.jar', 'application/java-archive'],
    ['.jpg', 'image/jpeg'],
    ['.json', 'application/json'],
    ['.mpeg', 'video/mpeg'],
    ['.png', 'image/png'],
    ['.pdf', 'application/pdf'],
    ['.rar', 'application/x-rar-compressed'],
    ['.sh', 'application/x-sh'],
    ['.txt', 'text/plain'],
    ['.webm', 'video/webm'],
    ['.mkv', 'video/x-matroska']

]);

class HttpRequestContainer {

    constructor(httpRequest) {
        const httpArray = httpRequest.toString().split("\r\n");
        for (const reqElement of httpArray) {
            let elementParts = reqElement.split(" ");
            if (reqElement.endsWith("HTTP/1.1")) {
                this._methodType = elementParts[0];
                this._url = elementParts[1];
            } else if (reqElement.startsWith("Host:")) {
                this._host = elementParts[1];
            } else if (reqElement.startsWith("Connection:")) {
                this._connection = elementParts[1];
            } else if (reqElement.startsWith("Accept:")) {
                this._accept = elementParts[1];
            }
        }
    }

    get methodType() {
        return this._methodType;
    }

    set methodType(name) {
        this._methodType = name;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get host() {
        return this._host;
    }

    set host(value) {
        this._host = value;
    }

    get connection() {
        return this._connection;
    }

    set connection(value) {
        this._connection = value;
    }

    get accept() {
        return this._accept;
    }

    set accept(value) {
        this._accept = value;
    }

}

class HttpResponseContainer {

    get separator() {
        return '\r\n';
    }

    get endOfResponse() {
        return this.separator + this.separator;
    }

    get head() {
        return 'HTTP/1.1 ' + this._statusCode + ' ' + httpCodeMessages.get(this._statusCode);
    }

    set statusCode(statusCodeNumber) {
        this._statusCode = statusCodeNumber;
    }

    set cacheControl(cacheControl) {
        this._cacheControl = cacheControl;
    }

    set server(value) {
        this._server = value;
    }

    set date(value) {
        this._date = value;
    }

    set connection(value) {
        this._connection = value;
    }

    set contentType(value) {
        this._contentType = value;
    }

    set contentLength(value) {
        this._contentLength = value;
    }

    toString() {
        return this.head
            + this.separator
            + this.stringCacheControl()
            + this.separator
            + this.stringServer()
            + this.separator
            + HttpResponseContainer.stringDate()
            + this.separator
            + this.stringConnection()
            + this.separator
            + this.stringContentType()
            + this.separator
            + this.stringContentLength()
            + this.endOfResponse;

    }

    stringCacheControl() {
        return 'Cache-Control: ' + (this._cacheControl === undefined ? 'no-cache' : this._cacheControl);
    }

    stringServer() {
        return 'Server: ' + this._server;
    }

    static stringDate() {
        return 'Date: ' + Date.now().toString();
    }

    stringConnection() {
        return 'Connection: ' + (this._connection === undefined ? 'close' : this._connection);
    }

    stringContentType() {
        return 'Content-Type: ' + (this._contentType === undefined ?  'text/html' : this._contentType);
    }

    stringContentLength() {
        return 'Content-Length: ' + (this._contentLength === undefined ? 0 : this._contentLength);
    }
}

module.exports = {
    mimeTypes : mimeTypes,
    HttpRequestContainer: HttpRequestContainer,
    HttpResponseContainer: HttpResponseContainer
};
