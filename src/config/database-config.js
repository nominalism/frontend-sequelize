
// Configuração do banco de dados no ambiente de teste

// export const databaseConfig = {
//   dialect: 'sqlite',
//   storage: 'database.sqlite',
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   }
// };

/*
// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/
// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d14v82fdiees73eds89g-a.oregon-postgres.render.com',
  username: 'scv_backend_node_sequelize_frontend_user',
  password: 'qz53fTVXcYgfQKCU31Tx7JktMuYThO7q',
  database: 'scv_backend_node_sequelize_frontend',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
};

