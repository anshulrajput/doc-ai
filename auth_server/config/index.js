const path = require("path");
const Joi = require("joi");

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: path.join(__dirname, "../.env") });
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "local")
      .required(),
    PORT: Joi.number().default(8080),
    DB_HOST: Joi.string().required(),
    DATABASE: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    SERVICE_ACCOUNT: Joi.string().required(),
    CORS_ORIGINS: Joi.string().required()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  logging.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  http_port: envVars.PORT,
  db_host: envVars.DB_HOST,
  database: envVars.DATABASE,
  db_username: envVars.DB_USERNAME,
  db_password: envVars.DB_PASSWORD,
  db_port: envVars.DB_PORT,
  service_account: envVars.SERVICE_ACCOUNT,
  cors_origins: envVars.CORS_ORIGINS.split(", ")
};
