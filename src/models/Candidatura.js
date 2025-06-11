import { Model, DataTypes } from 'sequelize';

class Candidatura extends Model {

  static init(sequelize) {
    super.init({
      data: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "A data deve ser válida!" }
        }
      },
      dados_atualizados: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      selecionado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, { sequelize, modelName: 'candidatura', tableName: 'candidaturas' })
  }

  static associate(models) {
    this.belongsTo(models.candidato, { as: 'candidato', foreignKey: { name: 'candidatoId', allowNull: false, validate: { notNull: { msg: 'Candidato deve ser preenchido!' } } } });
    this.belongsTo(models.vaga, { as: 'vaga', foreignKey: { name: 'vagaId', allowNull: false, validate: { notNull: { msg: 'Vaga deve ser preenchida!' } } } });
  }
  
}

export { Candidatura }; 