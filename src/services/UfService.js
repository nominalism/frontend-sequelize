import { Uf } from "../models/Uf.js";

/**
 * Serviço para o modelo Uf
 */
class UfService {

  static async findAll() {
    const objs = await Uf.findAll();
    return objs.map(obj => ({
      id: obj.id,
      sigla: obj.sigla,
      nome: obj.nome,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    }));
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Uf.findByPk(id);
    if (obj) {
      return {
        id: obj.id,
        sigla: obj.sigla,
        nome: obj.nome,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt
      };
    }
    return null;
  }

  static async create(req) {
    const { sigla, nome } = req.body;
    const obj = await Uf.create({ sigla, nome });
    return {
      id: obj.id,
      sigla: obj.sigla,
      nome: obj.nome,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    };
  }

  static async update(req) {
    const { id } = req.params;
    const { sigla, nome } = req.body;
    const obj = await Uf.findByPk(id);
    if (obj == null) throw 'UF não encontrada!';
    Object.assign(obj, { sigla, nome });
    await obj.save();
    
    return {
      id: obj.id,
      sigla: obj.sigla,
      nome: obj.nome,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    };
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Uf.findByPk(id);
    if (obj == null) throw 'UF não encontrada!';
    try {
      await obj.destroy();
      return {
        id: obj.id,
        sigla: obj.sigla,
        nome: obj.nome
      };
    } catch (error) {
      throw "Não é possível remover uma UF que possui cidades!";
    }
  }

}

export { UfService }; 