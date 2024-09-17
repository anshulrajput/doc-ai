const Sequelize = require("sequelize");
let sequelize;

sequelize = new Sequelize(
  config.database,
  config.db_username,
  config.db_password,
  {
    host: config.db_host,
    dialect: "postgres",
    port: config.db_port,
    logging: (msg) => logging.db(msg),

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

global.sequelize = sequelize;

module.exports = sequelize;
