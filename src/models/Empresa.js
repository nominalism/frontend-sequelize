// Leonardo
import { Model, DataTypes } from 'sequelize';

class Empresa extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "O nome da empresa deve ser preenchido!" }
        }
      },
      cnpj: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "O cnpj deve ser preenchido!" }
        }
      },
      telefone: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "O telefone deve ser preenchido!" }
        }
      },
      email: { 
        type: DataTypes.STRING, 
        validate: {
          isEmail: { msg: "O e-mail deve ser válido!" },
          notEmpty: { msg: "O e-mail deve ser preenchido!" }
        }
      },
      setor: { 
        type: DataTypes.ENUM('TECNOLOGIA', 'MARMORE', 'COMERCIO', 'SAUDE', 'ADMINISTRACAO'), 
        validate: {
          notEmpty: { msg: "O setor deve ser preenchido!" }
        }
      },
      numCasa: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "O número da casa deve ser um número inteiro!" }
        }
      },
      complemento: {
        type: DataTypes.STRING
      }
    }, { sequelize, modelName: 'empresa', tableName: 'empresas' })
  }

  static associate(models) {
    this.belongsTo(models.bairro, { as: 'bairro', foreignKey: { name: 'bairroId', allowNull: false, validate: { notNull: { msg: 'Bairro deve ser preenchido!' } } } });
    this.hasMany(models.processoseletivo, { as: { singular: 'processoSeletivo', plural: 'processosSeletivos' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  
}

export { Empresa };