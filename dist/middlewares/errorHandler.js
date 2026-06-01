export function errorHandler(err, req, res, next) {
    if ('statusCode' in err) {
        const httpErr = err;
        res.status(httpErr.statusCode).json({ message: httpErr.message });
    }
    else {
        console.error('Erro inesperado:', err);
        res.status(500).json({ message: 'Something broke!' });
    }
}
//# sourceMappingURL=errorHandler.js.map