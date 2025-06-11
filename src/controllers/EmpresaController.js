// Leonardo
import { EmpresaService } from "../services/EmpresaService.js";

/**
 * Controller para Empresa
 */
class EmpresaController {
  
  static async findAll(req, res, next) {
    EmpresaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    EmpresaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    EmpresaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    EmpresaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    EmpresaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { EmpresaController }; 