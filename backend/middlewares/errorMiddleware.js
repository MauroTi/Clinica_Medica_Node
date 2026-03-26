function errorMiddleware(error, req, res, next) {
  console.error('❌ Erro capturado pelo middleware global:', error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    mensagem: error.message || 'Erro interno do servidor.'
  });
}

export default errorMiddleware;