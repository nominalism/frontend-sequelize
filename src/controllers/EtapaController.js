// Yuri
import { EtapaService } from "../services/EtapaService.js";

/**
 * Controller para Etapa
 */
class EtapaController {
  
  static async findAll(req, res, next) {
    EtapaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    EtapaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async findByProcessoSeletivo(req, res, next) {
    EtapaService.findByProcessoSeletivo(req)
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async create(req, res, next) {
    EtapaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    EtapaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    EtapaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { EtapaController };