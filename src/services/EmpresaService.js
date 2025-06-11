// Leonardo
import { Empresa } from "../models/Empresa.js";
import { Bairro } from "../models/Bairro.js";

class EmpresaService {

  static async findAll() {
    const objs = await Empresa.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Empresa.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, cnpj, telefone, email, setor, numCasa, complemento, bairroId } = req.body;
    
    // Verificar se o Bairro existe
    const bairro = await Bairro.findByPk(bairroId);
    if (bairro == null) throw 'Bairro não encontrado!';
    
    const obj = await Empresa.create({ 
      nome, 
      cnpj, 
      telefone, 
      email, 
      setor, 
      numCasa,
      complemento,
      bairroId 
    });
    return await Empresa.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cnpj, telefone, email, setor, numCasa, complemento, bairroId } = req.body;
    
    // Verificar se o Bairro existe
    if (bairroId) {
      const bairro = await Bairro.findByPk(bairroId);
      if (bairro == null) throw 'Bairro não encontrado!';
    }
    
    const obj = await Empresa.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Empresa não encontrada!';
    
    Object.assign(obj, { nome, cnpj, telefone, email, setor, numCasa, complemento, bairroId });
    return await obj.save();
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Empresa.findByPk(id);
    if (obj == null) throw 'Empresa não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover uma empresa que possui processos seletivos associados!";
    }
  }

}

export { EmpresaService };
