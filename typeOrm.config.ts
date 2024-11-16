import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

function validateEnv(requiredEnvVars: string[]): void {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingVars.join(', ')}`,
    );
    process.exit(1);
  }
}
export const dbConfig = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const isProduction = NODE_ENV === 'production';

  switch (NODE_ENV) {
    case 'development':
      validateEnv(['DB_NAME_DEV']);
      break;
    case 'test':
      validateEnv(['DB_NAME_TEST']);
      break;
    case 'production':
      validateEnv(['DB_NAME', 'DB_HOST', 'DB_PORT', 'DB_PASSWORD', 'DB_USER']);
      break;
  }

  const dbConfig: DataSourceOptions = {
    type: isProduction ? 'postgres' : 'sqlite',
    host: process.env.DB_HOST,
    port: isProduction
      ? parseInt(process.env.DB_PORT || '5432', 10)
      : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:
      NODE_ENV === 'development'
        ? process.env.DB_NAME_DEV
        : NODE_ENV === 'test'
          ? process.env.DB_NAME_TEST
          : process.env.DB_NAME,
    entities:
      NODE_ENV === 'test' ? ['**/*.entity.ts'] : ['dist/**/*.entity.js'],
    migrations: ['./migrations/**/*.js'],
    migrationsTableName: 'custom_migration_table',
    synchronize: NODE_ENV !== 'production',
    migrationsRun: NODE_ENV === 'production',
  };

  return dbConfig;
};

// interface IDbConfig {
//   type?: string;
//   host?: string;
//   port?: number;
//   username?: string;
//   password?: string;
//   database?: string;
//   entities?: any;
//   migrations?: string[];
//   migrationsTableName?: 'custom_migration_table';
//   synchronize?: boolean;
//   migrationsRun?: boolean;
// }

// export const dbConfig: IDbConfig = {
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['./migrations/**/*.js'],
//   migrationsTableName: 'custom_migration_table',
//   synchronize: true,
//   migrationsRun: false,
// };

// switch (process.env.NODE_ENV) {
//   case 'production':
//     dbConfig.type = 'postgres';
//     dbConfig.host = process.env.DB_HOST;
//     dbConfig.port = parseInt(process.env.DB_PORT);
//     dbConfig.username = process.env.DB_USER;
//     dbConfig.password = process.env.DB_PASSWORD;
//     dbConfig.database = process.env.DB_NAME;
//     break;

//   case 'development':
//     dbConfig.type = 'sqlite';
//     dbConfig.database = process.env.DB_NAME_DEV;
//     break;

//   case 'test':
//     dbConfig.type = 'sqlite';
//     dbConfig.entities = ['**/*.entity.ts'];
//     dbConfig.database = process.env.DB_NAME_TEST;
//     dbConfig.synchronize = true;
//     dbConfig.migrationsRun = false;
//     break;
// }

export default new DataSource(dbConfig());
