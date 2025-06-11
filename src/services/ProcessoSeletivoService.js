// Gabriel Rosaes
import { ProcessoSeletivo } from "../models/ProcessoSeletivo.js";
import { Empresa } from "../models/Empresa.js";
import { Etapa } from "../models/Etapa.js";
import { Vaga } from "../models/Vaga.js";
import { Candidatura } from "../models/Candidatura.js";
import { Sequelize, QueryTypes } from "sequelize";
import { databaseConfig } from "../config/database-config.js";
const sequelize = new Sequelize(databaseConfig);

class ProcessoSeletivoService {

  static async findAll() {
    const objs = await ProcessoSeletivo.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await ProcessoSeletivo.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, data_inicio, data_final, descricao, empresaId } = req.body;
    
    const empresa = await Empresa.findByPk(empresaId);
    if (empresa == null) throw 'Empresa não encontrada!';
    
    // O status será definido como 'NAO_INICIADO' pelo defaultValue do model
    const obj = await ProcessoSeletivo.create({ 
      nome, 
      data_inicio, 
      data_final, 
      descricao, 
      empresaId 
    });
    // Retorna o objeto criado incluindo associações e o status default
    return await ProcessoSeletivo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    // Inclui o 'status' nos campos que podem vir do body
    const { nome, data_inicio, data_final, descricao, empresaId, status } = req.body;

    const processoSeletivo = await ProcessoSeletivo.findByPk(id, {
      include: [
        { model: Etapa, as: 'etapas' }, 
        { 
          model: Vaga, 
          as: 'vagas',
          include: [{ model: Candidatura, as: 'candidaturas' }]
        }
      ]
    });

    if (processoSeletivo == null) throw 'Processo Seletivo não encontrado!';

    // Regra: Não permitir alterações se já estiver Concluído ou Cancelado
    if (['CONCLUIDO', 'CANCELADO'].includes(processoSeletivo.status)) {
      throw `Processo Seletivo com status ${processoSeletivo.status} não pode ser alterado.`;
    }

    // Verifica se a intenção é CONCLUIR o processo
    if (status === 'CONCLUIDO') {
      const errorMessages = [];

      // Rosaes
      // Regra 3.1: A empresa só pode cadastrar a seleção final se todas as etapas dentro de um processo seletivo já estiverem finalizadas
      const etapasNaoConcluidas = processoSeletivo.etapas.filter(etapa => etapa.status_Etapa !== 'CONCLUIDO');
      if (etapasNaoConcluidas.length > 0) {
        const nomesEtapas = etapasNaoConcluidas.map(e => e.nome).join(', ');
        errorMessages.push(`As seguintes etapas não estão concluídas: ${nomesEtapas}.`);
      }

      // Rosaes
      // Regra 3.2: Todas as vagas pertencentes ao processo seletivo devem estar preenchidas para que a seleção seja registrada
      const vagasNaoPreenchidas = processoSeletivo.vagas.filter(vaga => {
        const selecionados = vaga.candidaturas.filter(c => c.selecionado === true);
        return selecionados.length < vaga.quantidade;
      });

      if (vagasNaoPreenchidas.length > 0) {
        const cargosVagas = vagasNaoPreenchidas.map(v => v.cargo).join(', ');
        errorMessages.push(`As seguintes vagas não estão totalmente preenchidas: ${cargosVagas}.`);
      }

      if (errorMessages.length > 0) {
        throw `Não é possível CONCLUIR o processo seletivo: ${errorMessages.join(' ')}`;
      }
      // Se passou nas verificações, permite a atualização para CONCLUIDO
    }

    // Verifica a empresa apenas se um novo empresaId foi fornecido
    if (empresaId && empresaId !== processoSeletivo.empresaId) {
      const empresa = await Empresa.findByPk(empresaId);
      if (empresa == null) throw 'Empresa não encontrada!';
    }
    
    // Atualiza o objeto com os dados recebidos (incluindo o status, se fornecido)
    Object.assign(processoSeletivo, { nome, data_inicio, data_final, descricao, empresaId, status });
    
    const updatedObj = await processoSeletivo.save();
    // Retorna o objeto atualizado incluindo associações
    return await ProcessoSeletivo.findByPk(updatedObj.id, { include: { all: true, nested: true } }); 
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await ProcessoSeletivo.findByPk(id);
    if (obj == null) throw 'Processo Seletivo não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      // Capturar erro específico de constraint de chave estrangeira
      if (error.name === 'SequelizeForeignKeyConstraintError') {
          throw "Não é possível remover um processo seletivo que possui registros associados (etapas, vagas, etc.)!";
      } 
      throw error; // Re-lança outros erros
    }
  }

  //Rosaes
  static async findProcessosPorEmpresa(req) {
    const sequelize = ProcessoSeletivo.sequelize;
    const objs = await sequelize.query(
      `SELECT e.id as empresa_id, e.nome as empresa_nome, e.cnpj, 
              COUNT(ps.id) as total_processos,
              COUNT(CASE WHEN ps.status = 'EM_ANDAMENTO' THEN 1 END) as processos_em_andamento,
              COUNT(CASE WHEN ps.status = 'CONCLUIDO' THEN 1 END) as processos_concluidos,
              COUNT(CASE WHEN ps.status = 'CANCELADO' THEN 1 END) as processos_cancelados,
              COUNT(CASE WHEN ps.status = 'NAO_INICIADO' THEN 1 END) as processos_nao_iniciados
       FROM empresas e
       LEFT JOIN processosseletivos ps ON e.id = ps.empresa_id
       GROUP BY e.id, e.nome, e.cnpj
       ORDER BY total_processos DESC`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (objs.length === 0) throw 'Nenhum processo seletivo encontrado';
    return objs;
  }
}

export { ProcessoSeletivoService };