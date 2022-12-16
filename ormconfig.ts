import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';
config();

const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  entities: ['dist/src/**/*.entity.js'],
  synchronize: false,
  migrations: [
    'dist/src/db/migrations/*.js'
  ],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  //@ts-ignore
  factories: ['dist/src/db/factories/**/*.js'],
  //@ts-ignore
  seeds: ['dist/src/db/seeds/**/*.js'] 
};

export default ormconfig;
