function notFoundMiddleware(req, res, next) {
  res.status(404).json({
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export default notFoundMiddleware;
