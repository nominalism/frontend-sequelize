import { InteresseService } from "../services/InteresseService.js";

/**
 * Controller para Interesse
 */
class InteresseController {
  
  static async findAll(req, res, next) {
    InteresseService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    InteresseService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async findByCandidato(req, res, next) {
    InteresseService.findByCandidato(req)
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByArea(req, res, next) {
    InteresseService.findByArea(req)
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async create(req, res, next) {
    InteresseService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    InteresseService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    InteresseService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { InteresseController };