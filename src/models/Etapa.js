// Yuri
import { Model, DataTypes } from 'sequelize';

class Etapa extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome da etapa deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome da etapa deve ter entre 2 e 50 letras!" }
        }
      },
      descricao: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Descrição deve ser preenchida!" }
        }
      },
      tipo: { 
        type: DataTypes.ENUM('ENTREVISTA', 'QUESTIONARIO', 'TESTE_PRATICO', 'DESAFIO', 'DINAMICA'), 
        validate: {
          notEmpty: { msg: "O tipo deve ser preenchido!" }
        }
      },
      status_Etapa: { 
        type: DataTypes.ENUM('PENDENTE', 'EM_PROCESSO', 'CONCLUIDO'), 
        validate: {
          notEmpty: { msg: "O status deve ser preenchido!" }
        }
      },
      max_candidatos: { 
        type: DataTypes.INTEGER, 
        validate: {
          isInt: { msg: "A quantidade máxima de candidatos deve ser um número inteiro" }
        }
      }
    }, { sequelize, modelName: 'etapa', tableName: 'etapas' })
  }

  static associate(models) {
    this.belongsTo(models.processoseletivo, { as: 'processoSeletivo', foreignKey: { name: 'processoSeletivoId', field: 'processoseletivo_id', allowNull: false, validate: { notNull: { msg: 'O processo seletivo deve ser preenchido!' } } } });
  }
  
}

export { Etapa };