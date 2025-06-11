import { Cidade } from "../models/Cidade.js";
import { Uf } from "../models/Uf.js";

class CidadeService {

  static async findAll() {
    const objs = await Cidade.findAll({
      include: [{ model: Uf, as: 'uf' }]
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cidade.findByPk(id, {
      include: [{ model: Uf, as: 'uf' }]
    });
    return obj;
  }

  static async findByUf(req) {
    const { id } = req.params;
    const objs = await Cidade.findAll({
      where: { ufId: id },
      include: [{ model: Uf, as: 'uf' }]
    });
    return objs;
  }

  static async create(req) {
    const { nome, ufId } = req.body;
    
    // Verificar se a UF existe
    const uf = await Uf.findByPk(ufId);
    if (uf == null) throw 'UF não encontrada!';
    
    const obj = await Cidade.create({ nome, ufId });
    return await Cidade.findByPk(obj.id, {
      include: [{ model: Uf, as: 'uf' }]
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, ufId } = req.body;
    
    // Verificar se a UF existe
    if (ufId) {
      const uf = await Uf.findByPk(ufId);
      if (uf == null) throw 'UF não encontrada!';
    }
    
    const obj = await Cidade.findByPk(id);
    if (obj == null) throw 'Cidade não encontrada!';
    
    Object.assign(obj, { nome, ufId });
    await obj.save();
    
    return await Cidade.findByPk(obj.id, {
      include: [{ model: Uf, as: 'uf' }]
    });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cidade.findByPk(id);
    if (obj == null) throw 'Cidade não encontrada!';
    try {
      await obj.destroy();
      return {
        id: obj.id,
        nome: obj.nome,
        ufId: obj.ufId
      };
    } catch (error) {
      throw "Não é possível remover uma cidade que possui bairros!";
    }
  }

}

export { CidadeService }; 