let products = [
  { id: 1, name: "iPhone 16 Pro Max", price: 1199, category: "pro", inStock: true },
  { id: 2, name: "iPhone 16", price: 799, category: "standard", inStock: true },
  { id: 3, name: "iPhone 15 Pro", price: 899, category: "pro", inStock: false },
];

export const getAllProductsFromDB = async () => {
  return products;
};

export const getProductByIdFromDB = async (id) => {
  return products.find((p) => p.id === id);
};

export const createProductInDB = async ({ name, price, category, inStock }) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price: Number(price),
    category,
    inStock,
  };
  products.push(newProduct);
  return newProduct;
};