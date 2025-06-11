import { Bairro } from "../models/Bairro.js";
import { Cidade } from "../models/Cidade.js";
import { Candidato } from "../models/Candidato.js";
import { Empresa } from "../models/Empresa.js";
import { ValidationError as SequelizeValidationError } from 'sequelize';

class BairroService {

  static async findAll() {
    const objs = await Bairro.findAll({
      include: [{ model: Cidade, as: 'cidade' }]
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Bairro.findByPk(id, {
      include: [{ model: Cidade, as: 'cidade' }]
    });
    return obj;
  }

  static async create(req) {
    const { bairro, cidadeId } = req.body;
    
    // Verificar se a Cidade existe
    const cidade = await Cidade.findByPk(cidadeId);
    if (cidade == null) throw 'Cidade não encontrada!';
    
    const obj = await Bairro.create({ bairro, cidadeId });
    
    // Retornar o objeto criado com a cidade associada
    return await Bairro.findByPk(obj.id, {
      include: [{ model: Cidade, as: 'cidade' }]
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { bairro, cidadeId } = req.body;
    
    // Verificar se a Cidade existe
    if (cidadeId) {
      const cidade = await Cidade.findByPk(cidadeId);
      if (cidade == null) throw 'Cidade não encontrada!';
    }
    
    const obj = await Bairro.findByPk(id);
    if (obj == null) throw 'Bairro não encontrado!';

    // Assign properties from request to the model instance
    // If 'bairro' or 'cidadeId' are not in req.body, they will be undefined here.
    // Object.assign will correctly update obj only with defined properties from the source.
    // If 'cidadeId' is explicitly 'null' in req.body, it will be set to null on 'obj'.
    Object.assign(obj, { bairro, cidadeId });

    try {
      await obj.save();
      
      // Retornar o objeto atualizado com a cidade associada
      return await Bairro.findByPk(obj.id, {
        include: [{ model: Cidade, as: 'cidade' }]
      });
    } catch (error) {
      if (error instanceof SequelizeValidationError) {
        // Iterate through validation errors to find one for 'cidadeId'
        for (const validationError of error.errors) {
          if (validationError.path === 'cidadeId') {
            throw validationError.message; // Throw the first validation message found for cidadeId
          }
        }
        // If no specific cidadeId error, concatenate all messages or throw a generic validation error
        const messages = error.errors.map(e => e.message);
        throw messages.join('; ') || 'Erro de validação desconhecido.';
      }
      throw error; // Re-throw other non-validation errors (e.g., database connection issues)
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Bairro.findByPk(id, {
      include: [
        { model: Candidato, as: 'candidatos', attributes: ['id'] },
        { model: Empresa, as: 'empresas', attributes: ['id'] }
      ]
    });

    if (obj == null) throw 'Bairro não encontrado!';

    if (obj.candidatos && obj.candidatos.length > 0) {
      throw "Não é possível remover um bairro que possui candidatos associados!";
    }
    if (obj.empresas && obj.empresas.length > 0) {
      throw "Não é possível remover um bairro que possui empresas associadas!";
    }

    try {
      const deletedBairroData = {
        id: obj.id,
        bairro: obj.bairro,
        cidadeId: obj.cidadeId
      };
      await obj.destroy();
      return deletedBairroData; // Return data of the deleted object
    } catch (error) {
      // This catch is for other unexpected errors during destroy, if any.
      console.error('Error during Bairro destroy:', error); // Log the actual error for debugging
      throw "Erro ao tentar remover o bairro. Verifique dependências ou contate o suporte."; 
    }
  }

}

export { BairroService }; 