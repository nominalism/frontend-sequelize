import { Model, DataTypes } from 'sequelize';

class Interesse extends Model {

  static init(sequelize) {
    super.init({
      data_Inicio: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "A data de início deve ser válida!" }
        }
      },
      data_Final: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "A data final deve ser válida!" }
        }
      }
    }, { sequelize, modelName: 'interesse', tableName: 'interesses' })
  }

  static associate(models) {
    this.belongsTo(models.candidato, { as: 'candidato', foreignKey: { name: 'candidatoId', allowNull: false, validate: { notNull: { msg: 'Candidato deve ser preenchido!' } } } });
    this.belongsTo(models.area, { as: 'area', foreignKey: { name: 'areaId', allowNull: false, validate: { notNull: { msg: 'Área deve ser preenchida!' } } } });
  }
  
}

export { Interesse }; 