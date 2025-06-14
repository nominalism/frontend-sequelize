// Gabriel Rosaes
import { Area } from "../models/Area.js";
import { Vaga } from "../models/Vaga.js";
import { Interesse } from "../models/Interesse.js";
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { Sequelize, QueryTypes } from "sequelize";
import { databaseConfig } from "../config/database-config.js";
const sequelize = new Sequelize(databaseConfig);

const DEFAULT_AREA_INCLUDES = [
  {
    association: 'vagas',
    as: 'areaVagas', // Alias for Area's own Vagas
    include: [
      {
        association: 'processoSeletivo',
        as: 'vagaProcessoSeletivo', // Alias
        include: [
          {
            association: 'empresa',
            as: 'processoEmpresa', // Alias
            include: [
              {
                association: 'bairro',
                as: 'empresaBairroViaAreaVaga', // Specific alias
                include: [
                  {
                    association: 'cidade',
                    as: 'empresaCidadeViaAreaVaga', // Specific alias
                    include: [{ association: 'uf', as: 'empresaUfViaAreaVaga' }] // Specific alias
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
    association: 'interesses',
    as: 'areaInteresses', // Alias for Area's own Interesses
    include: [
      {
        association: 'candidato',
        as: 'interesseCandidato', // Alias
        include: [
          {
            association: 'bairro',
            as: 'candidatoBairroViaAreaInteresse', // Specific alias (was candidatoBairro)
            include: [
              {
                association: 'cidade',
                as: 'candidatoCidadeViaAreaInteresse', // Specific alias (was candidatoCidade)
                include: [{ association: 'uf', as: 'candidatoUfViaAreaInteresse' }] // Specific alias (was candidatoUf)
              }
            ]
          }
        ]
      }
    ]
  }
];

class AreaService {
  static async findAll() {
    const objs = await Area.findAll({ include: DEFAULT_AREA_INCLUDES });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Area.findByPk(id, { include: DEFAULT_AREA_INCLUDES });
    return obj;
  }

  static async create(req) {
    const { nome, descricao, curso, candidatos_vaga } = req.body;
    try {
      const obj = await Area.create({ nome, descricao, curso, candidatos_vaga });
      return await Area.findByPk(obj.id, { include: DEFAULT_AREA_INCLUDES });
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
    const { nome, descricao, curso, candidatos_vaga } = req.body;
    
    const obj = await Area.findByPk(id, { include: DEFAULT_AREA_INCLUDES });
    if (obj == null) throw 'Área não encontrada!';
    
    // Ensure only fields present in the body are assigned
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (curso !== undefined) updateData.curso = curso;
    if (candidatos_vaga !== undefined) updateData.candidatos_vaga = candidatos_vaga;

    Object.assign(obj, updateData);
    
    try {
      await obj.save();
      return await Area.findByPk(obj.id, { include: DEFAULT_AREA_INCLUDES });
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
    const obj = await Area.findByPk(id);
    if (obj == null) throw 'Área não encontrada!';
    try {
      const deletedAreaData = { id: obj.id, nome: obj.nome }; // Store data before deleting
      await obj.destroy();
      return deletedAreaData;
    } catch (error) {
      console.error('Error during Area destroy:', error); 
      throw "Erro ao tentar remover a área. Verifique dependências ou contate o suporte."; 
    }
  }

  //Rosaes
  static async findContratacoesPorArea(req) {
    const sequelize = Area.sequelize;
    const objs = await sequelize.query(
      `SELECT a.id as area_id, a.nome as area_nome, a.curso, 
              COUNT(c.id) as total_contratacoes
       FROM areas a
       JOIN vagas v ON a.id = v.area_id
       JOIN candidaturas c ON v.id = c.vaga_id
       WHERE c.selecionado = true
       GROUP BY a.id, a.nome, a.curso
       ORDER BY total_contratacoes DESC`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (objs.length === 0) throw 'Nenhuma contratação encontrada';
    return objs;
  }
}

export { AreaService };