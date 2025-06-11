// Yuri
import { Candidato } from "../models/Candidato.js";
import { Bairro } from "../models/Bairro.js";

class CandidatoService {

  static async findAll() {
    const objs = await Candidato.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Candidato.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, cpf, email, telefone, data_nascimento, curso, turno, numCasa, complemento, bairroId } = req.body;
    
    // Verificar se o Bairro existe
    const bairro = await Bairro.findByPk(bairroId);
    if (bairro == null) throw 'Bairro não encontrado!';
    
    // Validar curso
    const cursosValidos = ['SIS_INFORMACAO', 'ADM', 'ENFERMAGEM', 'CONTABILIDADE', 'ENG_MECANICA'];
    if (curso && !cursosValidos.includes(curso)) {
      throw `Curso inválido. Os valores permitidos são: ${cursosValidos.join(', ')}`;
    }
    
    // Validar turno
    const turnosValidos = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];
    if (turno && !turnosValidos.includes(turno)) {
      throw `Turno inválido. Os valores permitidos são: ${turnosValidos.join(', ')}`;
    }
    
    try {
      const obj = await Candidato.create({ 
        nome, 
        cpf, 
        email, 
        telefone, 
        data_nascimento, 
        curso,
        turno,
        numCasa,
        complemento,
        bairroId
      });
      return await Candidato.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      // Capturar erros de validação do Sequelize e retornar mensagens mais amigáveis
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(e => e.message);
        throw messages.join(', ');
      }
      throw error;
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cpf, email, telefone, data_nascimento, curso, turno, numCasa, complemento, bairroId } = req.body;
    
    // Verificar se o Bairro existe
    if (bairroId) {
      const bairro = await Bairro.findByPk(bairroId);
      if (bairro == null) throw 'Bairro não encontrado!';
    }
    
    const obj = await Candidato.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Candidato não encontrado!';
    
    // Validar curso
    const cursosValidos = ['SIS_INFORMACAO', 'ADM', 'ENFERMAGEM', 'CONTABILIDADE', 'ENG_MECANICA'];
    if (curso && !cursosValidos.includes(curso)) {
      throw `Curso inválido. Os valores permitidos são: ${cursosValidos.join(', ')}`;
    }
    
    // Validar turno
    const turnosValidos = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];
    if (turno && !turnosValidos.includes(turno)) {
      throw `Turno inválido. Os valores permitidos são: ${turnosValidos.join(', ')}`;
    }
    
    try {
      Object.assign(obj, { nome, cpf, email, telefone, data_nascimento, curso, turno, numCasa, complemento, bairroId });
      return await obj.save();
    } catch (error) {
      // Capturar erros de validação do Sequelize e retornar mensagens mais amigáveis
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(e => e.message);
        throw messages.join(', ');
      }
      throw error;
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Candidato.findByPk(id);
    if (obj == null) throw 'Candidato não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um candidato que possui registros associados!";
    }
  }

}

export { CandidatoService };
