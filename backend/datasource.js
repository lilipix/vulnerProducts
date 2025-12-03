const { DataSource } = require("typeorm");

const dataSource = new DataSource({
  type: "sqlite",
  database: "./database.db",
  synchronize: true,
  entities: ["./entities/*.js"],
});

module.exports = { dataSource };
