import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import Users from "./model/Users.model.js"; // Importing the Users model
import Category from "./model/Category.model.js";
import Product from "./model/Product.model.js";
import "dotenv/config";
import multer from "multer";
import authRouter from "./routes/auth.js";
import { verifyAuth } from "./middleware/verify-auth.js";

const app = express();
console.log("Starting server...");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.use("/auth", authRouter);

app.post("/category", async (req, res) => {
  const category = req.body;
  const newCategory = new Category(category);
  await newCategory.save();
  res.send(newCategory);
});

app.get("/", (req, res) => {
  console.log(req.query.page, "@query");
  const object = {
    name: "node server",
    version: "1.0.0",
  };

  res.send(object);
});

app.post("/about/:userid", (req, res) => {
  console.log(req.body, "@body");
  console.log(req.params.userid, "@params");
  res.send("post request received");
});

app.get("/users", async function (req, res) {
  const { gender } = req.query;
  const users = await Users.find({ gender });
  res.send(users);
  // if (gender) {
  //   const filteredUsers = users.filter(user => user.gender === gender);
  //   res.send(filteredUsers);
  // }
  // res.send(users);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const newUser = new Users(user);
  await newUser.save();
  res.send(newUser);

  console.log(user, "@body");
});

app.post(`/load-users`, async (req, res) => {
  console.log(req.body, "@body");
  await Users.insertMany(req.body);
  res.send("Users loaded successfully");
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const deleteUser = await Users.findByIdAndDelete({ _id: id });
  res.send("User deleted successfully");
});

app.post("/product", async (req, res) => {
  const product = req.body;
  const newProduct = new Product(product);
  await newProduct.save();
  res.send(newProduct);
});

app.get("/product", verifyAuth, async (req, res) => {
  const products = await Product.find().populate("category");
  res.send(products);
});

app.get("/category", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

app.get("/product", async (req, res) => {
  const products = await Product.find().populate("category");
  res.send(products);
});

app.get("/products", verifyAuth, async (req, res) => {
  const id = req.params.id;
  const product = await Product.find().populate("category");
  res.send(product);
});
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const deleteProduct = await Product.findByIdAndDelete({ _id: id });
  res.send("Product deleted successfully");
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(id, product, {
    new: true,
  });
  res.send(updatedProduct);
});

app.post("/product-image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: `http://localhost:3000/product-images/${req.file.filename}`,
  });
});

app.listen(3000, async () => {
  console.log(`Server is running on port 3000`);
  await mongoose.connect(process.env.DB_URL);

  console.log("Connected to MongoDB");
});

// mongodb+srv://devkotapratik65:<db_password>@cluster0.yy5qmun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
