// 404 Not Found middleware
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    method: req.method,
    url: req.originalUrl
  })
}

export default notFound
