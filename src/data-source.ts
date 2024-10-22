import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    // url: 'postgresql://neondb_owner:cfanZ6z2qpvB@ep-tiny-salad-a1h07rj7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    type: 'mysql',
    host: 'sql12.freemysqlhosting.net',
    port: 3306,
    username: 'sql12739915',
    password: 'aM2EQiPvUj',
    database: 'sql12739915',
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*.ts`],
    synchronize: true, // set to false in production
    logging: true,
});
