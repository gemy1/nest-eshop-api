import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

interface IDbConfig {
  type?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  entities?: any;
  migrations?: string[];
  migrationsTableName?: 'custom_migration_table';
  synchronize?: boolean;
  migrationsRun?: boolean;
}

export const dbConfig: IDbConfig = {
  entities: ['dist/**/*.entity.js'],
  migrations: ['./migrations/**/*.js'],
  migrationsTableName: 'custom_migration_table',
  synchronize: true,
  migrationsRun: false,
};

switch (process.env.NODE_ENV) {
  case 'production':
    dbConfig.type = 'postgres';
    dbConfig.host = process.env.DB_HOST;
    dbConfig.port = parseInt(process.env.DB_PORT);
    dbConfig.username = process.env.DB_USER;
    dbConfig.password = process.env.DB_PASSWORD;
    dbConfig.database = process.env.DB_NAME;
    break;

  case 'development':
    dbConfig.type = 'sqlite';
    dbConfig.database = process.env.DB_NAME_DEV;
    break;

  case 'test':
    dbConfig.type = 'sqlite';
    dbConfig.entities = ['**/*.entity.ts'];
    dbConfig.database = process.env.DB_NAME_TEST;
    dbConfig.synchronize = true;
    dbConfig.migrationsRun = false;
    break;
}

export default new DataSource(dbConfig as any);
