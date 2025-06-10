import adminModel, { IAdmin } from "../models/adminModel";
import productModel from "../models/productModel";
import { IProduct } from "../models/productModel";


export const getAllAdmins = async () => {
  try {
    const admins = await adminModel.find();
    return admins;
  } catch (error) {
    throw new Error("Error fetching admins");
  }
};

export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    return products;
  } catch (error) {
    throw new Error("Error fetching products");
  }
};

// // Get product by ID
// export const getProductById = async (id: string): Promise<IProduct | null> => {
//   return productModel.findById(id).exec();
// };




const createProduct = async (productData: IProduct) => {
  try {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  }
  catch (error) {
    throw new Error("Error creating product");
  }
}


export const addProduct = async (productData: any) => {
  // Only admins call this to add products
  return createProduct(productData);
};




// Update existing product
export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

// Delete product
export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return productModel.findByIdAndDelete(id).exec();
};