import { config } from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  config({ path: `${process.cwd()}/.env-test` });
} else {
  config({ path: `${process.cwd()}/.env` });
}

const configuration = () => ({
  node_env: process.env.NODE_ENV ?? 'dev',

  api_version: process.env.API_VERSION ?? '1',
  port: parseInt(process.env.PORT ?? '3001', 10),
  app_url: process.env.APP_URL ?? 'http://localhost:3001',

  sql_logging: ['true', undefined].includes(process.env.DB_LOGGING),
  default_limit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT ?? '15', 10),

  databases: {
    DB: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME ?? 'qvema',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    },
  },

  jwt: {
    duration: parseInt(process.env.JWT_DURATION ?? '3600'),
    secret: process.env.JWT_SECRET ?? '',
  },
});

export default configuration;
