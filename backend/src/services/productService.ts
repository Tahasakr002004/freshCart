import productModel from "../models/mongodb/productModel";
import { Request, Response } from "express";


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
      imageUrl: "/public/freshcartImages/apple_2.jpg",
      stock: 100
    },
    {
      name: "Kiwi",
      price: 9.99,
      imageUrl: "/public/freshcartImages/kiwi_2.jpg",
      stock: 70
    },
    {
      name: "Banana",
      price: 12.99,
      imageUrl: "/public/freshcartImages/banana_2.jpg",
      stock: 0
    },
    {
      name: "Pineapple",
      price: 10.99,
      imageUrl: "/public/freshcartImages/pineapple_2.jpg",
      stock: 100
    },
    {
      name: "Chocolate",
      price: 5.99,
      imageUrl: "/public/freshcartImages/chocolate_2.jpg",
      stock: 200
    },
   {
      name: "Milk",
      price: 10.99,
      imageUrl: "/public/freshcartImages/milk_2.jpg",
      stock: 100
    },
    {
      name: "Cheese",
      price: 9.99,
      imageUrl: "/public/freshcartImages/cheese_2.jpg",
      stock: 70
    },
    {
      name: "Yogurt",
      price: 12.99,
      imageUrl: "/public/freshcartImages/yogurt_2.jpg",
      stock: 50
    },
    {
      name: "Strawberry",
      price: 10.99,
      imageUrl: "/public/freshcartImages/strawberry_2.jpg",
      stock: 100
    },
    {
      name: "Cereal",
      price: 5.99,
      imageUrl: "/public/freshcartImages/cereal_2.jpg",
      stock: 200
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

// export const createProduct = async (productData: any) => {
//   try {
//     const newProduct = new productModel(productData);
//     await newProduct.save();
//     return newProduct;
//   } catch (error) {
//     throw new Error("Error creating product");
//   }
// };
export const createProduct = async (req: Request<any, any, { name: string; price: string | number; stock: string | number }>, res: Response) => {
  
  try {
    const { name, price, stock } = req.body;

    // multer puts the file info in req.file
    const file = (req as any).file as Express.Multer.File | undefined;

    let imageUrl: string | undefined;

    if (file) {
      // index.ts serves: app.use('/images', express.static(...freshcartImages))
      imageUrl = `/images/${file.filename}`;
    }

    const newProduct = await productModel.create({
      name,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Failed to create product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};
