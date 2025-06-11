// Gabriel Rosaes
import { ProcessoSeletivoService } from "../services/ProcessoSeletivoService.js";

/**
 * Controller para ProcessoSeletivo
 */
class ProcessoSeletivoController {
  
  static async findAll(req, res, next) {
    ProcessoSeletivoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    ProcessoSeletivoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    ProcessoSeletivoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    ProcessoSeletivoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    ProcessoSeletivoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  //Rosaes
  static async findProcessosPorEmpresa(req, res, next) {
    ProcessoSeletivoService.findProcessosPorEmpresa(req)
      .then(objs => res.json(objs))
      .catch(next);
  }
}

export { ProcessoSeletivoController };