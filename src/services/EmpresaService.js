// Leonardo
import { Empresa } from "../models/Empresa.js";
import { Bairro } from "../models/Bairro.js";
// Adicione outras importações de modelo conforme necessário para os includes
import { ProcessoSeletivo } from "../models/ProcessoSeletivo.js";
import { Vaga } from "../models/Vaga.js";
import { Area } from "../models/Area.js";
import { Interesse } from "../models/Interesse.js";
import { Candidato } from "../models/Candidato.js";
import { Cidade } from "../models/Cidade.js";
import { Uf } from "../models/Uf.js";

const DEFAULT_EMPRESA_INCLUDES = [
  {
    association: 'bairro',
    include: [
      {
        association: 'cidade',
        include: [{ association: 'uf' }]
      }
    ]
  },
  {
    association: 'processosSeletivos',
    include: [
      {
        association: 'vagas',
        include: [{ association: 'area' }]
      }
    ]
  }
];

class EmpresaService {

  static async findAll() {
    const objs = await Empresa.findAll({ include: DEFAULT_EMPRESA_INCLUDES });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Empresa.findByPk(id, { include: DEFAULT_EMPRESA_INCLUDES });
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
    return await Empresa.findByPk(obj.id, { include: DEFAULT_EMPRESA_INCLUDES });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cnpj, telefone, email, setor, numCasa, complemento, bairroId } = req.body;
    
    // Verificar se o Bairro existe
    if (bairroId) {
      const bairro = await Bairro.findByPk(bairroId);
      if (bairro == null) throw 'Bairro não encontrado!';
    }
    
    const obj = await Empresa.findByPk(id, { include: DEFAULT_EMPRESA_INCLUDES });
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
