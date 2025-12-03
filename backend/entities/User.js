const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "text",
      unique: true,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    price: {
      type: "int",
      nullable: false,
    },
    image: {
      type: "text",
      nullable: true,
    },
    category: {
      type: "text",
      nullable: true,
    },
    rating_rate: {
      type: "int",
      nullable: true,
    },
    rating_count: {
      type: "int",
      nullable: true,
    },
  },
});
