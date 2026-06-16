/**
 * Database environment config.
 *
 * Same MongoDB database (MONGO_DB_NAME), separate collections per environment:
 *   production  -> users, plans, purchases, ...
 *   development -> dev_users, dev_plans, dev_purchases, ...
 *
 * Set DB_ENV in .env (or rely on NODE_ENV).
 */

export const DB_NAME = process.env.MONGO_DB_NAME || 'test';

export const DB_ENV = process.env.DB_ENV
    || (process.env.NODE_ENV === 'production' ? 'production' : 'development');

export const isProductionDb = () => DB_ENV === 'production';

export const getCollectionName = (baseName) => {
    if (isProductionDb()) {
        return baseName;
    }
    return `dev_${baseName}`;
};

export const buildMongoUri = (databaseName = DB_NAME) => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is required');
    }

    const [base, query = ''] = uri.split('?');
    const pathMatch = base.match(/mongodb(\+srv)?:\/\/[^/]+\/(.+)$/);

    if (pathMatch?.[2]) {
        return uri;
    }

    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const withDb = `${normalizedBase}/${databaseName}`;
    return query ? `${withDb}?${query}` : withDb;
};

export const logDatabaseConfig = () => {
    const prefix = isProductionDb() ? '(production collections)' : 'dev_*';
    console.log(`MongoDB database: ${DB_NAME} | DB_ENV: ${DB_ENV} | Collections: ${prefix}`);
};
