function globalErrorHandlerMiddleware(err, req, res, next) {
    return res.status(err?.httpCode ?? 500).json({
        name: err.name,
        status: err?.httpCode ?? 500,
        success: false,
        error: true,
        message: err?.message,
        // description: err?.description,
    });
}
export default globalErrorHandlerMiddleware;
//# sourceMappingURL=globalErrorMiddlware.js.map