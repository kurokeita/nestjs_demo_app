export default interface AppConfig {
  domain: string;
  port: number;
}

export default interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
