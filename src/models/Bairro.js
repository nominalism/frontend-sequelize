import { Model, DataTypes } from 'sequelize';

class Bairro extends Model {

  static init(sequelize) {
    super.init({
      bairro: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Bairro deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Bairro deve ter entre 2 e 50 letras!" }
        }
      }
    }, { sequelize, modelName: 'bairro', tableName: 'bairros' })
  }

  static associate(models) {
    this.belongsTo(models.cidade, { as: 'cidade', foreignKey: { name: 'cidadeId', allowNull: false, validate: { notNull: { msg: 'Cidade do Bairro deve ser preenchida!' } } } });
    this.hasMany(models.candidato, { as: { singular: 'candidato', plural: 'candidatos' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    this.hasMany(models.empresa, { as: { singular: 'empresa', plural: 'empresas' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  
}

export { Bairro };