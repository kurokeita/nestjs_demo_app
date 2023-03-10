import * as fs from 'fs';

const privateKey = fs.readFileSync('storage/oauth/private.pem', 'utf8');
const publicKey = fs.readFileSync('storage/oauth/public.crt', 'utf8');

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
    access_token_private_key: privateKey,
    access_token_public_key: publicKey,
    access_token_expiration_time: process.env.JWT_EXPIRATION_TIME,
  },
});
