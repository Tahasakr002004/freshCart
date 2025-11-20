import productModel from "../models/mongodb/productModel";


export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    return products;
  } catch (error) {
    throw new Error("Error fetching products");
  }
};
//////////////////////

export const seedInitialProducts = async () => {
  const initialProducts = [   
    {
      name: "Apple",
      price: 10.99,
      imageUrl: "/freshcartImages/apple_2.jpg",
      stock: 100,
    },
    {
      name: "Banana",
      price: 10.99,
      imageUrl: "/freshcartImages/banana_2.jpg",
      stock: 100,
    },
  ];
  try {   
    const existingProducts = await productModel.find();
    if (existingProducts.length === 0) {
      await productModel.insertMany(initialProducts);
      console.log("Initial products seeded successfully.");
    } else {
      console.log("Products already exist. Skipping seeding.");
    }
  }
  catch (error) {     
    console.error("Error seeding initial products:", error);
  }
};




//////////////////////////////////////////////////
export const getProductById = async (id: string) => {
  try {
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error fetching product by ID");
  }
};

export const createProduct = async (productData: any) => {
  try {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error("Error creating product");
  }
};
