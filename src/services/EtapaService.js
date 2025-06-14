// Yuri
import { Etapa } from "../models/Etapa.js";
import { ProcessoSeletivo } from "../models/ProcessoSeletivo.js";
import { Sequelize, QueryTypes } from "sequelize";
import { databaseConfig } from "../config/database-config.js";
const sequelize = new Sequelize(databaseConfig);

const DEFAULT_ETAPA_INCLUDES = [
  {
    association: 'processoSeletivo',
    include: [
      {
        association: 'empresa',
        include: [
          {
            association: 'bairro',
            include: [
              {
                association: 'cidade',
                include: [{ association: 'uf' }]
              }
            ]
          }
        ]
      }
    ]
  }
];

class EtapaService {

  static async findAll() {
    const objs = await Etapa.findAll({ include: DEFAULT_ETAPA_INCLUDES });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Etapa.findByPk(id, { include: DEFAULT_ETAPA_INCLUDES });
    return obj;
  }
  // Yuri
  // Method restored to exact logic from 'trabalho' project as per user instruction
  static async findByProcessoSeletivo(req) {
    const { processoSeletivoId, etapaId } = req.params;
    const id = processoSeletivoId || req.params.id;

    let query = `SELECT e.* FROM "etapas" e
                 WHERE e.processoseletivo_id = :id`;

    if (etapaId) {
        query += ` AND e.id = :etapaId`;
    }

    const objs = await sequelize.query(query, {
        replacements: {
            id,
            ...(etapaId && { etapaId })
        },
        type: QueryTypes.SELECT,
        model: Etapa,
        mapToModel: true
    });

    if (objs.length === 0) {
        throw 'Nenhuma etapa encontrada para este processo seletivo!';
    }

    return objs;
  }

  static async create(req) {
    const { nome, descricao, tipo, status_Etapa, max_candidatos, processoSeletivoId } = req.body;
    
    // Verificar se o Processo Seletivo existe
    const processoSeletivo = await ProcessoSeletivo.findByPk(processoSeletivoId);
    if (processoSeletivo == null) throw 'Processo Seletivo não encontrado!';
    
    const obj = await Etapa.create({ 
      nome, 
      descricao, 
      tipo, 
      status_Etapa, 
      max_candidatos, 
      processoSeletivoId 
    });
    return await Etapa.findByPk(obj.id, { include: DEFAULT_ETAPA_INCLUDES });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, descricao, tipo, status_Etapa, max_candidatos, processoSeletivoId } = req.body;
    
    // Verificar se o Processo Seletivo existe
    if (processoSeletivoId) {
      const processoSeletivo = await ProcessoSeletivo.findByPk(processoSeletivoId);
      if (processoSeletivo == null) throw 'Processo Seletivo não encontrado!';
    }
    
    const obj = await Etapa.findByPk(id, { include: DEFAULT_ETAPA_INCLUDES });
    if (obj == null) throw 'Etapa não encontrada!';
    
    Object.assign(obj, { nome, descricao, tipo, status_Etapa, max_candidatos, processoSeletivoId });
    await obj.save(); // Ensure save is awaited
    return await Etapa.findByPk(obj.id, { include: DEFAULT_ETAPA_INCLUDES }); // Return the updated object with includes
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Etapa.findByPk(id);
    if (obj == null) throw 'Etapa não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover uma etapa que possui registros associados!";
    }
  }

}

export { EtapaService };