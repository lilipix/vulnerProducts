const express = require("express");
const cors = require("cors");

const app = express();
const axios = require("axios");
const argon2 = require("argon2");

require("reflect-metadata");

const port = 8000;

app.use(cors());

const { dataSource } = require("./datasource");

dataSource
  .initialize()
  .then(() => {
    console.log("TypeORM connecté à SQLite !");
  })
  .catch((err) => {
    console.error("Erreur TypeORM :", err);
  });

async function insertRandomUsers() {
  try {
    const urls = [1, 2, 3, 4, 5].map(() =>
      axios.get("https://randomuser.me/api/")
    );
    const results = await Promise.all(urls);
    const users = results.map((r) => r.data.results[0]);

    users.forEach(async (u) => {
      const username = u.login.username;
      const password = u.login.password;
      const email = u.email;

      const hashedPassword = await argon2.hash(password);

      const userRepo = dataSource.getRepository("User");

      const user = userRepo.create({
        username,
        email,
        password: hashedPassword,
        isAdmin: 0,
      });

      await UserRepo.save(user);
    });
    console.log("Inserted 5 random users into database.");
  } catch (err) {
    console.error("Error inserting users:", err.message);
  }
}
async function insertProductsFromAPI() {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    const productRepo = dataSource.getRepository("Product");

    for (const p of products) {
      const product = productRepo.create({
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        rating_rate: p.rating.rate,
        rating_count: p.rating.count,
      });

      await productRepo.save(product);
    }

    console.log(`Inserted ${products.length} products into database.`);
  } catch (err) {
    console.error("Error fetching products:", err.message);
  }
}

app.get("/generate-users", async (req, res) => {
  await insertRandomUsers();
  res.json({ success: true, message: "Generated 5 random users" });
});

app.get("/generate-products", async (req, res) => {
  await insertProductsFromAPI();
  res.send("products generated");
});

app.get("/products/search", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";

    const products = await datasource
      .getRepository("Product")
      .createQueryBuilder("product")
      .where("product.title LIKE :search", { search: `%${searchTerm}%` })
      .orWhere("product.description LIKE :search", {
        search: `%${searchTerm}%`,
      })
      .orWhere("product.category LIKE :search", { search: `%${searchTerm}%` })
      .getMany();

    res.json(products);
  } catch (err) {
    console.error("Error TypeORM:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const product = dataSource.getRepository("Product");
    const products = await product.find();

    res.json(products);
  } catch (err) {
    console.error("Erreur TypeORM :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const productRepo = dataSource.getRepository("Product");
    const product = await productRepo.findOneBy({ id: productId });

    res.json(product);
  } catch (err) {
    console.error("Erreur TypeORM :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello Ipssi v2!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
