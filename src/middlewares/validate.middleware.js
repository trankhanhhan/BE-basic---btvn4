export const validateCreateProduct = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || price === undefined || price === null || price === '') {
    const error = new Error("Thiếu thông tin bắt buộc: 'name' và 'price' không được để trống!");
    error.statusCode = 400;
    return next(error);
  }

  next();
};