// Gabriel Rosaes
import { Model, DataTypes } from 'sequelize';

class ProcessoSeletivo extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.INTEGER, 
        validate: {
          isInt: { msg: "O nome do processo seletivo deve ser um número inteiro!" }
        }
      },
      data_inicio: { 
        type: DataTypes.DATE, 
        validate: {
          isDate: { msg: "Data inicial do processo seletivo deve ser preenchida!" },
        }
      },
      data_final: { 
        type: DataTypes.DATE, 
        validate: {
          isDate: { msg: "Data final do processo seletivo deve ser preenchida!" },
        }
      },
      descricao: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "A descrição do processo seletivo deve ser preenchida!" }
        }
      },
      status: {
        type: DataTypes.ENUM('NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'),
        defaultValue: 'NAO_INICIADO',
        allowNull: false,
        validate: {
          isIn: {
            args: [['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']],
            msg: "Status inválido para o processo seletivo."
          }
        }
      }
    }, { sequelize, modelName: 'processoseletivo', tableName: 'processosseletivos' })
  }

  static associate(models) {
    this.belongsTo(models.empresa, { as: 'empresa', foreignKey: { name: 'empresaId', field: 'empresa_id', allowNull: false, validate: { notNull: { msg: 'Empresa do processo seletivo deve ser preenchida!' } } } });
    this.hasMany(models.etapa, { as: { singular: 'etapa', plural: 'etapas' }, foreignKey: { name: 'processoSeletivoId', field: 'processoseletivo_id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    this.hasMany(models.vaga, { as: { singular: 'vaga', plural: 'vagas' }, foreignKey: { name: 'processoSeletivoId', field: 'processoseletivo_id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  
}

export { ProcessoSeletivo };