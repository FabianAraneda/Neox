import sql from 'mssql';

const dbSetting = {
    dialect: 'mssql',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    server: process.env.SERVER,
    port: Number.parseInt(process.env.DBPORT),
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
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
