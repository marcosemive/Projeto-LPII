export class HttpError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'HttpError';
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
export default HttpError;
//# sourceMappingURL=index.js.map