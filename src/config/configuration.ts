export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    domain: process.env.APP_DOMAIN ?? 'localhost',
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    access_token_private_key: process.env.JWT_PRIVATE_KEY,
    access_token_public_key: process.env.JWT_PUBLIC_KEY,
    access_token_expiration_time: process.env.JWT_EXPIRATION_TIME,
  },
});
