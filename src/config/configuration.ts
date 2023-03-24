import * as fs from 'fs';

const privateKey = fs.readFileSync('storage/oauth/private.pem', 'utf8');
const publicKey = fs.readFileSync('storage/oauth/public.crt', 'utf8');

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    domain: process.env.APP_DOMAIN ?? 'localhost',
  },
  jwt: {
    access_token_private_key: privateKey,
    access_token_public_key: publicKey,
    access_token_expiration_time: process.env.JWT_EXPIRATION_TIME,
    refresh_token_expirationo_time: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  },
});
