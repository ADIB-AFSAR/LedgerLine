import './preload-env.js';

/**
 * One Atlas cluster, separate databases via MONGO_DB_NAME:
 *   Dev        + DB_ENV=development -> dev_users, dev_plans, ...
 *   Production + DB_ENV=production  -> users, plans, ...
 */

export const getDbName = () => process.env.MONGO_DB_NAME || 'test';

export const getDbEnv = () => process.env.DB_ENV
    || (process.env.NODE_ENV === 'production' ? 'production' : 'development');

export const isProductionDb = () => getDbEnv() === 'production';

export const getCollectionName = (baseName) => {
    if (isProductionDb()) {
        return baseName;
    }
    return `dev_${baseName}`;
};

export const buildMongoUri = (databaseName = getDbName()) => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is required');
    }

    const [, query = ''] = uri.split('?');
    const hostMatch = uri.match(/^(mongodb(\+srv)?:\/\/[^/?]+)/);
    if (!hostMatch) {
        throw new Error('Invalid MONGO_URI format');
    }

    const withDb = `${hostMatch[1]}/${databaseName}`;
    return query ? `${withDb}?${query}` : withDb;
};

export const createModel = (connection, modelName, schema, baseCollectionName) => {
    const collectionName = getCollectionName(baseCollectionName);

    if (connection.models[modelName]) {
        connection.deleteModel(modelName);
    }

    return connection.model(modelName, schema, collectionName);
};

export const logDatabaseConfig = () => {
    const prefix = isProductionDb() ? '(production collections)' : 'dev_*';
    console.log(`MongoDB database: ${getDbName()} | DB_ENV: ${getDbEnv()} | Collections: ${prefix}`);
    console.log(`Users collection: ${getCollectionName('users')}`);
};
