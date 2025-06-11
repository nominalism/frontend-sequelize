import express from "express";

import { UfController } from "./controllers/UfController.js";
import { CidadeController } from "./controllers/CidadeController.js";
import { BairroController } from "./controllers/BairroController.js";
import { EmpresaController } from "./controllers/EmpresaController.js";
import { CandidatoController } from "./controllers/CandidatoController.js";
import { AreaController } from "./controllers/AreaController.js";
import { ProcessoSeletivoController } from "./controllers/ProcessoSeletivoController.js";
import { VagaController } from "./controllers/VagaController.js";
import { EtapaController } from "./controllers/EtapaController.js";
import { InteresseController } from "./controllers/InteresseController.js";
import { CandidaturaController } from "./controllers/CandidaturaController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";

const routes = express.Router();

// Rotas para UF
routes.get("/ufs", UfController.findAll);
routes.get("/ufs/:id", UfController.findByPk);
routes.post("/ufs", UfController.create);
routes.put("/ufs/:id", UfController.update);
routes.delete("/ufs/:id", UfController.delete);

// Rotas para Cidade
routes.get("/cidades", CidadeController.findAll);
routes.get("/cidades/:id", CidadeController.findByPk);
routes.post("/cidades", CidadeController.create);
routes.put("/cidades/:id", CidadeController.update);
routes.delete("/cidades/:id", CidadeController.delete);
routes.get("/cidades/findByUf/:id", CidadeController.findByUf);

// Rotas para Bairro
routes.get("/bairros", BairroController.findAll);
routes.get("/bairros/:id", BairroController.findByPk);
routes.post("/bairros", BairroController.create);
routes.put("/bairros/:id", BairroController.update);
routes.delete("/bairros/:id", BairroController.delete);

// Leonardo
routes.get("/empresas", EmpresaController.findAll);
routes.get("/empresas/:id", EmpresaController.findByPk);
routes.post("/empresas", EmpresaController.create);
routes.put("/empresas/:id", EmpresaController.update);
routes.delete("/empresas/:id", EmpresaController.delete);

// Yuri
routes.get("/candidatos", CandidatoController.findAll);
routes.get("/candidatos/:id", CandidatoController.findByPk);
routes.post("/candidatos", CandidatoController.create);
routes.put("/candidatos/:id", CandidatoController.update);
routes.delete("/candidatos/:id", CandidatoController.delete);

// Rosaes
routes.get("/areas", AreaController.findAll);
routes.get("/areas/:id", AreaController.findByPk);
routes.post("/areas", AreaController.create);
routes.put("/areas/:id", AreaController.update);
routes.delete("/areas/:id", AreaController.delete);

// Rosaes
// Processo de negócio: Gestão de Processo Seletivo (Seleção Final)
// Regra 3.1: A empresa só pode cadastrar a seleção final se todas as etapas dentro de um processo seletivo já estiverem finalizadas
// Regra 3.2: Todas as vagas pertencentes ao processo seletivo devem estar preenchidas para que a seleção seja registrada
routes.get("/processos", ProcessoSeletivoController.findAll);
routes.get("/processos/:id", ProcessoSeletivoController.findByPk);
routes.post("/processos", ProcessoSeletivoController.create);
routes.put("/processos/:id", ProcessoSeletivoController.update);
routes.delete("/processos/:id", ProcessoSeletivoController.delete);

// Leonardo
routes.get("/vagas", VagaController.findAll);
routes.get("/vagas/:id", VagaController.findByPk);
routes.post("/vagas", VagaController.create);
routes.put("/vagas/:id", VagaController.update);
routes.delete("/vagas/:id", VagaController.delete);
routes.get(
  "/vagas/findByProcessoSeletivo/:id",
  VagaController.findByProcessoSeletivo,
);
routes.get("/vagas/findByArea/:id", VagaController.findByArea);

// Yuri
routes.get("/etapas", EtapaController.findAll);
routes.get("/etapas/:id", EtapaController.findByPk);
routes.post("/etapas", EtapaController.create);
routes.put("/etapas/:id", EtapaController.update);
routes.delete("/etapas/:id", EtapaController.delete);
routes.get(
  "/etapas/findByProcessoSeletivo/:id",
  EtapaController.findByProcessoSeletivo,
);
//Yuri - Relatório de Etapas por Processo Seletivo
routes.get(
  "/etapas/findByProcessoSeletivo/:processoSeletivoId/etapa/:etapaId",
  EtapaController.findByProcessoSeletivo, // Corrected to use the unified controller method
);

// Rotas para Interesse
routes.get("/interesses", InteresseController.findAll);
routes.get("/interesses/:id", InteresseController.findByPk);
routes.post("/interesses", InteresseController.create);
routes.put("/interesses/:id", InteresseController.update);
routes.delete("/interesses/:id", InteresseController.delete);
routes.get(
  "/interesses/findByCandidato/:id",
  InteresseController.findByCandidato,
);
routes.get("/interesses/findByArea/:id", InteresseController.findByArea);

// Yuri
// Processo de negócio: Gestão de Candidatura
// Regra 1.1: Para candidatar-se o candidato precisa estar de acordo com os requisitos da vaga
// Regra 1.2: O candidato não pode se candidatar em duas vagas no mesmo processo seletivo
// Rotas para Candidatura
routes.get("/candidaturas", CandidaturaController.findAll);
routes.get("/candidaturas/:id", CandidaturaController.findByPk);
routes.post("/candidaturas", CandidaturaController.create);
routes.put("/candidaturas/:id", CandidaturaController.update);
routes.delete("/candidaturas/:id", CandidaturaController.delete);
routes.get(
  "/candidaturas/findByCandidato/:id",
  CandidaturaController.findByCandidato,
);
routes.get("/candidaturas/findByVaga/:id", CandidaturaController.findByVaga);

//Yuri - Relatório de Contratados
routes.get("/candidaturas/findBySelecionado/:selecionado", CandidaturaController.findBySelecionado);
//Leonardo - Relatório de Candidaturas por Vaga
routes.get("/candidaturas/relatorios/candidaturasPorVaga", CandidaturaController.findCandidaturasPorVaga);
//Leonardo - Relatório de Contratações por Empresa
routes.get("/candidaturas/relatorios/contratacoesPorEmpresa", CandidaturaController.findContratacoesPorEmpresa);

// Rotas para Usuário
routes.get("/usuarios", UsuarioController.findAll);
routes.get("/usuarios/:id", UsuarioController.findByPk);
routes.post("/usuarios", UsuarioController.create);
routes.put("/usuarios/:id", UsuarioController.update);
routes.delete("/usuarios/:id", UsuarioController.delete);

//Rosaes - Relatório de Processos Seletivos por Empresa
routes.get("/processos/relatorios/processosPorEmpresa", ProcessoSeletivoController.findProcessosPorEmpresa);
//Rosaes - Relatório de Contratações por Área
routes.get("/areas/relatorios/contratacoesPorArea", AreaController.findContratacoesPorArea);

export default routes;

