// Yuri
import { Model, DataTypes } from 'sequelize';

class Candidato extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do candidato deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do candidato deve ter entre 2 e 50 letras!" }
        }
      },
      cpf: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "CPF do candidado deve ser preenchido!" },
        }
      },
      email: { 
        type: DataTypes.STRING, 
        validate: {
          isEmail: { msg: "E-mail deve ser válido!" },
          notEmpty: { msg: "E-mail deve ser preenchido!" }
        }
      },
      telefone: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Telefone deve ser preenchido!" }
        }
      },
      data_nascimento: { 
        type: DataTypes.DATE, 
        validate: {
          isDate: { msg: "Data de nascimento deve ser uma data válida!" }
        }
      },
      curso: {
        type: DataTypes.ENUM('SIS_INFORMACAO', 'ADMINISTRACAO', 'ENFERMAGEM', 'CONTABILIDADE', 'ENG_MECANICA', 'DIREITO'),
        validate: {
          notEmpty: { msg: "O curso deve ser preenchido!" }
        }
      },
      turno: {
        type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO', 'INTEGRAL'),
        validate: {
          notEmpty: { msg: "O turno deve ser preenchido!" }
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
    }, { sequelize, modelName: 'candidato', tableName: 'candidatos' })
  }

  static associate(models) {
    this.belongsTo(models.bairro, { as: 'bairro', foreignKey: { name: 'bairroId', allowNull: false, validate: { notNull: { msg: 'Bairro do candidato deve ser preenchido!' } } } });
    this.hasMany(models.candidatura, { as: { singular: 'candidatura', plural: 'candidaturas' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    this.hasMany(models.interesse, { as: { singular: 'interesse', plural: 'interesses' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  
}

export { Candidato };