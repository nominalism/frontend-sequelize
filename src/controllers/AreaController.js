// Gabriel Rosaes
import { AreaService } from "../services/AreaService.js";

/**
 * Controller para Area
 */
class AreaController {
  
  static async findAll(req, res, next) {
    AreaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    AreaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    AreaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    AreaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    AreaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  //Rosaes
  static async findContratacoesPorArea(req, res, next) {
    AreaService.findContratacoesPorArea(req)
      .then(objs => res.json(objs))
      .catch(next);
  }
}

export { AreaController };