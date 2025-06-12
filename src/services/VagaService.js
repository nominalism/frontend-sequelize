// Leonardo
import { Vaga } from "../models/Vaga.js";
import { ProcessoSeletivo } from "../models/ProcessoSeletivo.js";
import { Area } from "../models/Area.js";
import { Candidatura } from "../models/Candidatura.js";
import { ValidationError as SequelizeValidationError } from 'sequelize';

// Importações adicionais para includes detalhados
import { Empresa } from "../models/Empresa.js";
import { Bairro } from "../models/Bairro.js";
import { Cidade } from "../models/Cidade.js";
import { Uf } from "../models/Uf.js";
import { Interesse } from "../models/Interesse.js";
import { Candidato } from "../models/Candidato.js";

const DEFAULT_VAGA_INCLUDES = [
  {
    association: 'processoSeletivo',
    include: [
      {
        association: 'empresa',
        include: [
          {
            association: 'bairro',
            as: 'empresaBairro', // Alias para Bairro em Empresa
            include: [
              {
                association: 'cidade',
                as: 'empresaCidade', // Alias para Cidade em Bairro de Empresa
                include: [{ association: 'uf', as: 'empresaUf' }] // Alias para UF em Cidade de Empresa
              }
            ]
          }
        ]
      }
      // Adicionar 'etapas' aqui se necessário e se ProcessoSeletivo tiver essa associação
    ]
  },
  {
    association: 'area',
    include: [
      {
        association: 'interesses',
        include: [
          {
            association: 'candidato',
            include: [
              {
                association: 'bairro',
                as: 'candidatoBairroViaArea', // Alias para Bairro em Candidato via Area/Interesse
                include: [
                  {
                    association: 'cidade',
                    as: 'candidatoCidadeViaArea',
                    include: [{ association: 'uf', as: 'candidatoUfViaArea' }]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    association: 'candidaturas',
    include: [
      {
        association: 'candidato',
        as: 'candidatoDaCandidatura', // Alias para Candidato em Candidatura
        include: [
           {
            association: 'bairro',
            as: 'candidatoBairroViaCandidatura', // Alias para Bairro em Candidato via Candidatura
            include: [
              {
                association: 'cidade',
                as: 'candidatoCidadeViaCandidatura',
                include: [{ association: 'uf', as: 'candidatoUfViaCandidatura' }]
              }
            ]
          }
        ]
      }
    ]
  }
];

class VagaService {

  static async findAll() {
    const objs = await Vaga.findAll({ include: DEFAULT_VAGA_INCLUDES });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Vaga.findByPk(id, { include: DEFAULT_VAGA_INCLUDES });
    return obj;
  }

  static async findByProcessoSeletivo(req) {
    const { id } = req.params;
    const objs = await Vaga.findAll({
      where: { processoSeletivoId: id },
      include: DEFAULT_VAGA_INCLUDES
    });
    return objs;
  }

  static async findByArea(req) {
    const { id } = req.params;
    const objs = await Vaga.findAll({
      where: { areaId: id },
      include: DEFAULT_VAGA_INCLUDES
    });
    return objs;
  }

  static async create(req) {
    const { cargo, carga_horaria, remuneracao, turno, nivel_escolaridade, modalidade, quantidade, processoSeletivoId, areaId } = req.body;
    
    const processoSeletivo = await ProcessoSeletivo.findByPk(processoSeletivoId);
    if (processoSeletivo == null) throw 'Processo Seletivo não encontrado!';
    
    const area = await Area.findByPk(areaId);
    if (area == null) throw 'Área não encontrada!';
    
    try {
      const obj = await Vaga.create({ 
        cargo, 
        carga_horaria, 
        remuneracao, 
        turno, 
        nivel_escolaridade, 
        modalidade, 
        quantidade, 
        processoSeletivoId, 
        areaId 
      });
      return await Vaga.findByPk(obj.id, { include: DEFAULT_VAGA_INCLUDES });
    } catch (error) {
      if (error instanceof SequelizeValidationError) {
        const messages = error.errors.map(e => e.message);
        throw messages.join('; ');
      }
      throw error;
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { cargo, carga_horaria, remuneracao, turno, nivel_escolaridade, modalidade, processoSeletivoId, areaId } = req.body;
    
   
    if (processoSeletivoId) {
      const processoSeletivo = await ProcessoSeletivo.findByPk(processoSeletivoId);
      if (processoSeletivo == null) throw 'Processo Seletivo não encontrado!';
    }
    
    // Verificar se a Área existe
    if (areaId) {
      const area = await Area.findByPk(areaId);
      if (area == null) throw 'Área não encontrada!';
    }
    
    const obj = await Vaga.findByPk(id, { include: DEFAULT_VAGA_INCLUDES });
    if (obj == null) throw 'Vaga não encontrada!';

    const updateData = {};
    if (cargo !== undefined) updateData.cargo = cargo;
    if (carga_horaria !== undefined) updateData.carga_horaria = carga_horaria;
    if (remuneracao !== undefined) updateData.remuneracao = remuneracao;
    if (turno !== undefined) updateData.turno = turno;
    if (nivel_escolaridade !== undefined) updateData.nivel_escolaridade = nivel_escolaridade;
    if (modalidade !== undefined) updateData.modalidade = modalidade;
    if (req.body.quantidade !== undefined) updateData.quantidade = req.body.quantidade; 
    if (processoSeletivoId !== undefined) updateData.processoSeletivoId = processoSeletivoId;
    if (areaId !== undefined) updateData.areaId = areaId;

    Object.assign(obj, updateData);
    
    try {
      await obj.save();
      return await Vaga.findByPk(obj.id, { include: DEFAULT_VAGA_INCLUDES });
    } catch (error) {
      if (error instanceof SequelizeValidationError) {
        const messages = error.errors.map(e => e.message);
        throw messages.join('; ');
      }
      throw error;
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Vaga.findByPk(id, {
      include: [{ model: Candidatura, as: 'candidaturas', attributes: ['id'] }]
    });

    if (obj == null) throw 'Vaga não encontrada!';

    if (obj.candidaturas && obj.candidaturas.length > 0) {
      throw "Não é possível remover uma vaga que possui candidaturas associadas!";
    }

    try {
      const deletedVagaData = { id: obj.id, cargo: obj.cargo }; 
      await obj.destroy();
      return deletedVagaData;
    } catch (error) {
  
      console.error('Error during Vaga destroy:', error);
      throw "Erro ao tentar remover a vaga. Verifique o console do servidor para mais detalhes.";
    }
  }

}

export { VagaService };