import { UsuarioService } from "../services/UsuarioService.js";

class UsuarioController {
  
  static async findAll(req, res, next) {
    UsuarioService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    UsuarioService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    UsuarioService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    UsuarioService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    UsuarioService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { UsuarioController }; 