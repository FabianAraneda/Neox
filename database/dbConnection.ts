import sql from 'mssql';

const dbSetting = {
    dialect: 'mssql',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    server: 'localhost',
    port: 1434,
    database: 'Neox',
    user: 'test',
    password: 'test',
};

const dbConnection = async () => {
    try {
        return await sql.connect(dbSetting);
    } catch (error) {
        console.error('Error al conectar la base de datos:', error);
        throw new Error('Error al conectar la base de datos');
    }
};

export { dbConnection };
