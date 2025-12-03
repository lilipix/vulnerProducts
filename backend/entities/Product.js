const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "text",
      nullable: false,
    },
    email: {
      type: "text",
      nullable: false,
    },
    password: {
      type: "text",
      nullable: false,
    },
    is_admin: {
      type: "int",
      default: 0,
    },
    created_at: {
      type: "text",
    },
  },
});
