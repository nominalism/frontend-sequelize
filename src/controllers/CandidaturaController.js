import { CandidaturaService } from "../services/CandidaturaService.js";

/**
 * Controller para Candidatura
 */
class CandidaturaController {
  
  static async findAll(req, res, next) {
    CandidaturaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CandidaturaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async findByCandidato(req, res, next) {
    CandidaturaService.findByCandidato(req)
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByVaga(req, res, next) {
    CandidaturaService.findByVaga(req)
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async create(req, res, next) {
    CandidaturaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CandidaturaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CandidaturaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  //Yuri - Relatório de Contratados
  static async findBySelecionado(req, res, next) {
    CandidaturaService.findBySelecionado(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  //Leonardo - Relatório de Candidaturas por Vaga
  static async findCandidaturasPorVaga(req, res, next) {
    CandidaturaService.findCandidaturasPorVaga(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  //Leonardo - Relatório de Contratações por Empresa
  static async findContratacoesPorEmpresa(req, res, next) {
    CandidaturaService.findContratacoesPorEmpresa(req)
      .then(objs => res.json(objs))
      .catch(next);
  }
}

export { CandidaturaController };