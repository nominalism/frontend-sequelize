// Yuri
import { CandidatoService } from "../services/CandidatoService.js";

/**
 * Controller para Candidato
 */
class CandidatoController {
  
  static async findAll(req, res, next) {
    CandidatoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CandidatoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CandidatoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CandidatoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CandidatoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { CandidatoController }; 