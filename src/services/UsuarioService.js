import { Usuario } from "../models/Usuario.js";

class UsuarioService {

  static async findAll() {
    const objs = await Usuario.findAll();
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Usuario.findByPk(id);
    return obj;
  }

  static async create(req) {
    const { nome, email, senha } = req.body;
    const obj = await Usuario.create({ nome, email, senha });
    return obj;
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    
    const obj = await Usuario.findByPk(id);
    if (obj == null) {
      throw new Error("Usuário não encontrado");
    }

    obj.nome = nome;
    obj.email = email;
    obj.senha = senha;
    
    await obj.save();
    return obj;
  }

  static async delete(req) {
    const { id } = req.params;
    
    const obj = await Usuario.findByPk(id);
    if (obj == null) {
      throw new Error("Usuário não encontrado");
    }
    
    await obj.destroy();
    return obj;
  }
}

export { UsuarioService }; 