import { Model, DataTypes } from 'sequelize';

class Usuario extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do usuário deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do usuário deve ter entre 2 e 50 letras!" }
        }
      },
      email: { 
        type: DataTypes.STRING, 
        validate: {
          isEmail: { msg: "E-mail deve ser válido!" },
          notEmpty: { msg: "E-mail deve ser preenchido!" }
        }
      },
      senha: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Senha deve ser preenchida!" },
          len: { args: [6, 100], msg: "Senha deve ter no mínimo 6 caracteres!" }
        }
      },
      perfil: {
        type: DataTypes.ENUM('ADMIN', 'USUARIO'),
        defaultValue: 'USUARIO',
        validate: {
          notEmpty: { msg: "O perfil deve ser preenchido!" }
        }
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, { sequelize, modelName: 'usuario', tableName: 'usuarios' })
  }

  static associate(models) {
    // Se houver associações com outros modelos, adicione aqui
  }
  
}

export { Usuario }; 