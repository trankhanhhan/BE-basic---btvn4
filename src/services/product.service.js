import {
  getAllProductsFromDB,
  getProductByIdFromDB,
  createProductInDB,
} from '../repositories/product.repository.js';

export const getAllProducts = async ({ category, maxPrice } = {}) => {
  let products = await getAllProductsFromDB();

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (maxPrice !== undefined) {
    const priceCap = Number(maxPrice);
    if (!isNaN(priceCap)) {
      products = products.filter((p) => p.price <= priceCap);
    }
  }

  return products;
};

export const getProductById = async (id) => {
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    const error = new Error('ID sản phẩm phải là một số hợp lệ!');
    error.statusCode = 400;
    throw error;
  }

  const product = await getProductByIdFromDB(numericId);
  if (!product) {
    const error = new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const createProduct = async ({ name, price, category = 'standard', inStock = true }) => {
  const products = await getAllProductsFromDB();

  const isExisted = products.some(
    (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (isExisted) {
    const error = new Error('Sản phẩm này đã tồn tại!');
    error.statusCode = 409;
    throw error;
  }

  if (Number(price) <= 0) {
    const error = new Error('Giá sản phẩm phải lớn hơn 0!');
    error.statusCode = 400;
    throw error;
  }

  const createdProduct = await createProductInDB({
    name: name.trim(),
    price: Number(price),
    category,
    inStock: Boolean(inStock),
  });

  return createdProduct;
};