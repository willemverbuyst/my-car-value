import { DataSource, DataSourceOptions } from 'typeorm';

const createAppDataSource = () => {
  const appDataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
  } as DataSourceOptions);

  return appDataSource;
};

export const appDataSource = createAppDataSource();
