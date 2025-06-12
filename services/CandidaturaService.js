//Yuri
import { Candidatura } from "../models/Candidatura.js";
import { Candidato } from "../models/Candidato.js";
import { Vaga } from "../models/Vaga.js";
import { Area } from "../models/Area.js";
import { ProcessoSeletivo } from "../models/ProcessoSeletivo.js";

import { Sequelize, QueryTypes } from "sequelize";
import { databaseConfig } from "../config/database-config.js";
const sequelize = new Sequelize(databaseConfig);

class CandidaturaService {

  static async findAll() {
    const objs = await Candidatura.findAll({
      include: [
        { model: Candidato, as: 'candidato' },
        { model: Vaga, as: 'vaga' }
      ]
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Candidatura.findByPk(id, {
      include: [
        { model: Candidato, as: 'candidato' },
        { 
          model: Vaga, 
          as: 'vaga',
          include: [ // Further include ProcessoSeletivo and Area from Vaga
            { model: ProcessoSeletivo, as: 'processoSeletivo' },
            { model: Area, as: 'area' }
          ]
        }
      ]
    });
    return obj;
  }

  static async findByCandidato(req) {
    const { id } = req.params;
    const objs = await Candidatura.findAll({
      where: { candidatoId: id },
      include: [
        // Candidato is already part of the where clause
        { 
          model: Vaga, 
          as: 'vaga',
          include: [
            { model: ProcessoSeletivo, as: 'processoSeletivo' },
            { model: Area, as: 'area' }
          ]
        }
      ]
    });
    return objs;
  }

  static async findByVaga(req) {
    const { id } = req.params;
    const objs = await Candidatura.findAll({
      where: { vagaId: id },
      include: [
        { model: Candidato, as: 'candidato' }
        // Vaga is already part of the where clause
      ]
    });
    return objs;
  }

  static async create(req) {
    const { data, dados_atualizados, selecionado, candidatoId, vagaId } = req.body;
    
    // Verificar se o Candidato existe
    const candidato = await Candidato.findByPk(candidatoId);
    if (candidato == null) throw 'Candidato não encontrado!';
    
    // Verificar se a Vaga existe e incluir Area e ProcessoSeletivo associados
    const vaga = await Vaga.findByPk(vagaId, { 
      include: [
        { model: Area, as: 'area' },
        { model: ProcessoSeletivo, as: 'processoSeletivo' }
      ] 
    });
    if (vaga == null) throw 'Vaga não encontrada!';
    if (vaga.area == null) throw 'Área associada à vaga não encontrada!';
    if (vaga.processoSeletivo == null) throw 'Processo seletivo associado à vaga não encontrado!';

    // Array para coletar múltiplos erros de validação
    const errorMessages = [];

    // Yuri
    // Regra 1.1: Para candidatar-se o candidato precisa estar de acordo com os requisitos da vaga
    // Verificamos se o curso do candidato é compatível com o curso da área da vaga
    if (candidato.curso !== vaga.area.curso) {
      errorMessages.push(`Curso do candidato (${candidato.curso}) incompatível com o curso da área da vaga (${vaga.area.curso}).`);
    }
    
    // Verificamos se o turno do candidato é compatível com o turno da vaga
    if (candidato.turno !== vaga.turno) {
      errorMessages.push(`Turno do candidato (${candidato.turno}) incompatível com o turno da vaga (${vaga.turno}).`);
    }
    
    // Yuri
    // Regra 1.2: O candidato não pode se candidatar em duas vagas no mesmo processo seletivo
    const processoSeletivoId = vaga.processoSeletivo.id;
    
    // Buscar todas as candidaturas do candidato
    const candidaturasExistentes = await Candidatura.findAll({
      where: {
        candidatoId: candidatoId
      },
      include: [{
        model: Vaga,
        as: 'vaga',
        include: [{ model: ProcessoSeletivo, as: 'processoSeletivo' }]
      }]
    });
    
    // Verificar se alguma candidatura existente é para o mesmo processo seletivo mas vaga diferente
    const candidaturaNoMesmoProcesso = candidaturasExistentes.find(c => 
      c.vaga && 
      c.vaga.processoSeletivo && 
      c.vaga.processoSeletivo.id === processoSeletivoId &&
      c.vagaId !== vagaId
    );

    if (candidaturaNoMesmoProcesso) {
      errorMessages.push(`O candidato já possui uma candidatura para outra vaga no processo seletivo ${vaga.processoSeletivo.nome || vaga.processoSeletivo.descricao || processoSeletivoId}.`);
    }

    // Se há erros de validação, lança todos simultaneamente
    if (errorMessages.length > 0) {
      throw `Não é possível criar a candidatura: ${errorMessages.join(' ')}`;
    }
    
    const obj = await Candidatura.create({ 
      data,
      dados_atualizados,
      selecionado,
      candidatoId, 
      vagaId 
    });
    return await Candidatura.findByPk(obj.id, { // Explicit include for the created object
      include: [
        { model: Candidato, as: 'candidato' },
        { 
          model: Vaga, 
          as: 'vaga',
          include: [
            { model: ProcessoSeletivo, as: 'processoSeletivo' },
            { model: Area, as: 'area' }
          ]
        }
      ]
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { data, dados_atualizados, selecionado, candidatoId, vagaId } = req.body;
    
    // Verificar se o Candidato existe
    if (candidatoId) {
      const candidato = await Candidato.findByPk(candidatoId);
      if (candidato == null) throw 'Candidato não encontrado!';
    }
    
    // Verificar se a Vaga existe
    if (vagaId) {
      const vaga = await Vaga.findByPk(vagaId);
      if (vaga == null) throw 'Vaga não encontrada!';
    }
    
    const objBeforeUpdate = await Candidatura.findByPk(id); // Fetch without includes before assign
    if (objBeforeUpdate == null) throw 'Candidatura não encontrada!';
    
    Object.assign(objBeforeUpdate, { data, dados_atualizados, selecionado, candidatoId, vagaId });
    await objBeforeUpdate.save();

    // After saving, fetch with explicit includes for the response
    const updatedObj = await Candidatura.findByPk(id, {
      include: [
        { model: Candidato, as: 'candidato' },
        { 
          model: Vaga, 
          as: 'vaga',
          include: [
            { model: ProcessoSeletivo, as: 'processoSeletivo' },
            { model: Area, as: 'area' }
          ]
        }
      ]
    });
    return updatedObj;
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Candidatura.findByPk(id);
    if (obj == null) throw 'Candidatura não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta candidatura!";
    }
  }

  //Yuri - Relatório de Contratados
  static async findBySelecionado(req) {
    const { selecionado } = req.params;
    const objs = await sequelize.query(
      'SELECT * FROM "candidaturas" WHERE selecionado = :selecionado',
      {
        replacements: { selecionado: selecionado === 'true' },
        type: sequelize.QueryTypes.SELECT,
        model: Candidatura,
        mapToModel: true,
      }
    );
    if (objs.length === 0) throw 'Nenhuma candidatura encontrada com o status selecionado: ' + selecionado;
    return objs;
  }

  //Leonardo
  static async findCandidaturasPorVaga(req) {
    const objs = await sequelize.query(
      `SELECT v.id as vaga_id, v.cargo, v.carga_horaria, v.turno, 
              COUNT(c.id) as total_candidaturas
       FROM vagas v
       LEFT JOIN candidaturas c ON v.id = c.vaga_id
       GROUP BY v.id, v.cargo, v.carga_horaria, v.turno
       ORDER BY total_candidaturas DESC`,
      {
        type: QueryTypes.SELECT
      }
    );
    if (objs.length === 0) throw 'Nenhuma candidatura encontrada';
    return objs;
  }

  //Leonardo
  static async findContratacoesPorEmpresa(req) {
    const objs = await sequelize.query(
      `SELECT e.id as empresa_id, e.nome as empresa_nome, e.cnpj,
              COUNT(c.id) as total_contratacoes
       FROM empresas e
       JOIN processosseletivos ps ON e.id = ps.empresa_id
       JOIN vagas v ON ps.id = v.processoseletivo_id
       JOIN candidaturas c ON v.id = c.vaga_id
       WHERE c.selecionado = true
       GROUP BY e.id, e.nome, e.cnpj
       ORDER BY total_contratacoes DESC`,
      {
        type: QueryTypes.SELECT
      }
    );
    if (objs.length === 0) throw 'Nenhuma contratação encontrada';
    return objs;
  }
}

export { CandidaturaService };