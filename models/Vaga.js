// Leonardo
import { Model, DataTypes } from 'sequelize';

class Vaga extends Model {

  static init(sequelize) {
    super.init({
      cargo: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "O cargo deve ser preenchido" }
        }
      },
      carga_horaria: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "A carga horária deve ser um número inteiro" }
        }
      },
      remuneracao: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: { msg: "A remuneração deve ser um valor decimal" }
        }
      },
      turno: {
        type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO', 'INTEGRAL'),
        validate: {
          notEmpty: { msg: "O turno deve ser preenchido" }
        }
      },
      nivel_escolaridade: {
        type: DataTypes.ENUM(
          "ENS_MEDIO",
          "ENS_MEDIO_INC",
          "GRADUACAO",
          "GRADUACAO_INC",
          "POS",
          "SUPERIOR_COMPLETO",
          "MEDIO_COMPLETO"
        ),
        validate: {
          notEmpty: { msg: "O nível de escolaridade deve ser preenchido" }
        }
      },
      quantidade: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          notEmpty: { msg: "A quantidade de vagas deve ser preenchida." },
          isInt: { msg: "A quantidade de vagas deve ser um número inteiro." },
          min: { args: [1], msg: "A quantidade de vagas deve ser no mínimo 1." }
        }
      },
      modalidade: {
        type: DataTypes.ENUM('à distância', 'presencial', 'semi-presencial', 'PRESENCIAL', 'HIBRIDO', 'REMOTO'),
        validate: {
          notEmpty: { msg: "A modalidade deve ser preenchida" }
        }
      }
    }, { sequelize, modelName: 'vaga', tableName: 'vagas' })
  }

  static associate(models) {
    this.belongsTo(models.processoseletivo, { as: 'processoSeletivo', foreignKey: { name: 'processoSeletivoId', field: 'processoseletivo_id', allowNull: false, validate: { notNull: { msg: 'O processo seletivo deve ser preenchido!' } } } });
    this.belongsTo(models.area, { as: 'area', foreignKey: { name: 'areaId', field: 'area_id', allowNull: false, validate: { notNull: { msg: 'A área deve ser preenchida!' } } } });
    this.hasMany(models.candidatura, { as: { singular: 'candidatura', plural: 'candidaturas' }, foreignKey: { name: 'vagaId', field: 'vaga_id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
}

export { Vaga };