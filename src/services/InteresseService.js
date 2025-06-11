//Leonardo
import { Interesse } from "../models/Interesse.js";
import { Candidato } from "../models/Candidato.js";
import { Area } from "../models/Area.js";

class InteresseService {

  static async findAll() {
    const objs = await Interesse.findAll({
      include: [
        { model: Candidato, as: 'candidato' /*, include: [{ model: Bairro, as: 'bairro' }] */ }, // Example of deeper include
        { model: Area, as: 'area' /*, include: [{ model: Vaga, as: 'vagas' }] */ } // Example of deeper include
      ]
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Interesse.findByPk(id, {
      include: [
        { model: Candidato, as: 'candidato' },
        { model: Area, as: 'area' }
      ]
    });
    return obj;
  }

  static async findByCandidato(req) {
    const { id } = req.params;
    const objs = await Interesse.findAll({
      where: { candidatoId: id },
      include: [
        // No need to include Candidato again as we are querying by it
        { model: Area, as: 'area' }
      ]
    });
    return objs;
  }

  static async findByArea(req) {
    const { id } = req.params;
    const objs = await Interesse.findAll({
      where: { areaId: id },
      include: [
        { model: Candidato, as: 'candidato' }
        // No need to include Area again as we are querying by it
      ]
    });
    return objs;
  }

  static async create(req) {
    const { data_Inicio, data_Final, candidatoId, areaId } = req.body;
    
    // Verificar se o Candidato existe
    const candidato = await Candidato.findByPk(candidatoId);
    if (candidato == null) throw 'Candidato não encontrado!';
    
    // Verificar se a Área existe
    const area = await Area.findByPk(areaId);
    if (area == null) throw 'Área não encontrada!';
    
    // Array para coletar múltiplos erros de validação
    const errorMessages = [];
    
    // Leonardo
    // Regra 2.1: O candidato deve estar cursando um curso correspondente a algum listado dentro da área
    if (candidato.curso !== area.curso) {
       errorMessages.push(`O curso do candidato (${candidato.curso}) não corresponde ao curso da área (${area.curso})!`);
     }

    // Leonardo
    // Regra 2.2: O candidato pode manter até dois alertas simultaneamente ativos
    const interessesAtivos = await Interesse.count({ where: { candidatoId: candidatoId } });
    if (interessesAtivos >= 2) {
      errorMessages.push('O candidato já possui o número máximo de 2 interesses registrados.');
    }

    // Se há erros de validação, lança todos simultaneamente
    if (errorMessages.length > 0) {
      throw `Não é possível criar o interesse: ${errorMessages.join(' ')}`;
    }
    
    const obj = await Interesse.create({ 
      data_Inicio,
      data_Final,
      candidatoId, 
      areaId 
    });
    // For the return, explicitly include what you need, similar to findByPk
    return await Interesse.findByPk(obj.id, {
      include: [
        { model: Candidato, as: 'candidato' },
        { model: Area, as: 'area' }
      ]
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { data_Inicio, data_Final, candidatoId, areaId } = req.body;
    
    // Verificar se o Interesse existe
    const interesse = await Interesse.findByPk(id);
    if (interesse == null) throw 'Interesse não encontrado!';
    
    // Variáveis para armazenar candidato e área
    let candidato = null;
    let area = null;
    
    // Verificar se o Candidato existe e se foi alterado
    if (candidatoId && candidatoId !== interesse.candidatoId) {
      candidato = await Candidato.findByPk(candidatoId);
      if (candidato == null) throw 'Candidato não encontrado!';
    } else if (candidatoId) {
      candidato = await Candidato.findByPk(candidatoId);
    }
    
    // Verificar se a Área existe e se foi alterada
    if (areaId && areaId !== interesse.areaId) {
      area = await Area.findByPk(areaId);
      if (area == null) throw 'Área não encontrada!';
    } else if (areaId) {
      area = await Area.findByPk(areaId);
    }
    
    // Se tanto o candidato quanto a área foram especificados, verificar compatibilidade
    if (candidato && area) {
      // Regra de negócio: verificar se o curso do candidato corresponde ao curso da área
      if (candidato.curso !== area.curso) {
        throw 'O candidato deve estar cursando um curso correspondente ao curso da área!';
      }
    } 
    // Se apenas um deles foi alterado, precisamos buscar o outro para verificar
    else if (candidato) {
      const areaAtual = await Area.findByPk(interesse.areaId);
      if (candidato.curso !== areaAtual.curso) {
        throw 'O candidato deve estar cursando um curso correspondente ao curso da área!';
      }
    } 
    else if (area) {
      const candidatoAtual = await Candidato.findByPk(interesse.candidatoId);
      if (candidatoAtual.curso !== area.curso) {
        throw 'O candidato deve estar cursando um curso correspondente ao curso da área!';
      }
    }
    
    const obj = await Interesse.findByPk(id); // Fetch without includes before assign
    Object.assign(obj, { data_Inicio, data_Final, candidatoId, areaId });
    await obj.save(); // Save the changes
    
    // After saving, fetch with explicit includes for the response
    const updatedObj = await Interesse.findByPk(id, {
      include: [
        { model: Candidato, as: 'candidato' },
        { model: Area, as: 'area' }
      ]
    });
    return updatedObj;
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Interesse.findByPk(id);
    if (obj == null) throw 'Interesse não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um interesse que possui registros associados!";
    }
  }

}

export { InteresseService };