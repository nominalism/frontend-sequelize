// Gabriel Rosaes
import { Model, DataTypes } from 'sequelize';

class Area extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome da área deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome da área deve ter entre 2 e 50 letras!" }
        }
      },
      descricao: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Descrição deve ser preenchida!" }
        }
      },
      curso: { 
        type: DataTypes.ENUM('SIS_INFORMACAO', 'ADMINISTRACAO', 'ENFERMAGEM', 'CONTABILIDADE', 'ENG_MECANICA', 'DIREITO'), 
        validate: {
          notEmpty: { msg: "Curso deve ser preenchido!" }
        }
      },
      candidatos_vaga: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "Candidatos por vaga deve ser um número inteiro" }
        }
      }
    }, { sequelize, modelName: 'area', tableName: 'areas' })
  }

  static associate(models) {
    this.hasMany(models.vaga, { as: { singular: 'vaga', plural: 'vagas' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    this.hasMany(models.interesse, { as: { singular: 'interesse', plural: 'interesses' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  
}

export { Area };