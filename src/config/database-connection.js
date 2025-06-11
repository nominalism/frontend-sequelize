import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Uf } from '../models/Uf.js';
import { Cidade } from '../models/Cidade.js';
import { Bairro } from '../models/Bairro.js';
import { Empresa } from '../models/Empresa.js';
import { Candidato } from '../models/Candidato.js';
import { ProcessoSeletivo } from '../models/ProcessoSeletivo.js';
import { Vaga } from '../models/Vaga.js';
import { Area } from '../models/Area.js';
import { Etapa } from '../models/Etapa.js';
import { Interesse } from '../models/Interesse.js';
import { Candidatura } from '../models/Candidatura.js';
import { Usuario } from '../models/Usuario.js';
import * as fs from 'fs';

const sequelize = new Sequelize({ ...databaseConfig, logging: console.log });

// Inicializando modelos
Uf.init(sequelize);
Cidade.init(sequelize);
Bairro.init(sequelize);
Empresa.init(sequelize);
Candidato.init(sequelize);
ProcessoSeletivo.init(sequelize);
Vaga.init(sequelize);
Area.init(sequelize);
Etapa.init(sequelize);
Interesse.init(sequelize);
Candidatura.init(sequelize);
Usuario.init(sequelize);

// Definindo associações entre modelos
Uf.associate(sequelize.models);
Cidade.associate(sequelize.models);
Bairro.associate(sequelize.models);
Empresa.associate(sequelize.models);
Candidato.associate(sequelize.models);
ProcessoSeletivo.associate(sequelize.models);
Vaga.associate(sequelize.models);
Area.associate(sequelize.models);
Etapa.associate(sequelize.models);
Interesse.associate(sequelize.models);
Candidatura.associate(sequelize.models);
Usuario.associate(sequelize.models);

//databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true }); 

        // Criando UFs
        const uf1 = await Uf.create({ sigla: "ES", nome: "Espírito Santo" });
        const uf2 = await Uf.create({ sigla: "MG", nome: "Minas Gerais" });

        // Criando Cidades
        const cidade1 = await Cidade.create({ nome: "Cachoeiro", ufId: uf1.id });
        const cidade2 = await Cidade.create({ nome: "Alegre", ufId: uf1.id });
        const cidade3 = await Cidade.create({ nome: "Belo Horizonte", ufId: uf2.id });
        const cidade4 = await Cidade.create({ nome: "Lavras", ufId: uf2.id });

        // Criando Bairros
        const bairro1 = await Bairro.create({ bairro: "Vila do Sul", cidadeId: cidade1.id });
        const bairro2 = await Bairro.create({ bairro: "Guararema", cidadeId: cidade1.id });
        const bairro3 = await Bairro.create({ bairro: "Maria Ortiz", cidadeId: cidade2.id });
        const bairro4 = await Bairro.create({ bairro: "Centro", cidadeId: cidade2.id });
        const bairro5 = await Bairro.create({ bairro: "Barro Preto", cidadeId: cidade3.id });
        const bairro6 = await Bairro.create({ bairro: "Cidade Jardim", cidadeId: cidade3.id });
        const bairro7 = await Bairro.create({ bairro: "Vale do Sol", cidadeId: cidade4.id });
        const bairro8 = await Bairro.create({ bairro: "Nova Lavras", cidadeId: cidade4.id });

        // Criando Empresas
        const empresa1 = await Empresa.create({ 
            nome: "Empresa ABC Tecnologia", 
            cnpj: "12.345.678/0001-99", 
            telefone: "(28) 3333-4444", 
            email: "contato@abctech.com", 
            setor: "TECNOLOGIA",
            numCasa: 123,
            complemento: "Sala 101",
            bairroId: bairro1.id 
        });
        
        const empresa2 = await Empresa.create({ 
            nome: "Hospital São Lucas", 
            cnpj: "98.765.432/0001-88", 
            telefone: "(28) 5555-6666", 
            email: "contato@saolucas.com.br", 
            setor: "SAUDE",
            numCasa: 456,
            complemento: "Bloco B",
            bairroId: bairro3.id 
        });

        // Criando Candidatos
        const candidato1 = await Candidato.create({ 
            nome: "João da Silva", 
            cpf: "111.222.333-44", 
            email: "joao@email.com", 
            telefone: "27999887766", 
            data_nascimento: "1995-05-15",
            curso: "SIS_INFORMACAO",
            turno: "MATUTINO",
            numCasa: 789,
            complemento: "Apto 303",
            bairroId: bairro2.id 
        });
        
        const candidato2 = await Candidato.create({ 
            nome: "Maria Oliveira", 
            cpf: "555.666.777-88", 
            email: "maria@email.com", 
            telefone: "27998765432", 
            data_nascimento: "1990-10-20",
            curso: "ENFERMAGEM",
            turno: "NOTURNO",
            numCasa: 101,
            complemento: "Casa",
            bairroId: bairro4.id 
        });

        // Criando Áreas
        const area1 = await Area.create({ 
            nome: "Desenvolvimento", 
            descricao: "Área de desenvolvimento de software", 
            curso: "SIS_INFORMACAO", 
            candidatos_vaga: 5 
        });
        
        const area2 = await Area.create({ 
            nome: "Enfermagem", 
            descricao: "Área de enfermagem hospitalar", 
            curso: "ENFERMAGEM", 
            candidatos_vaga: 3 
        });

        // Criando Processos Seletivos
        const processo1 = await ProcessoSeletivo.create({ 
            nome: 1001, 
            data_inicio: "2023-05-01", 
            data_final: "2023-06-30", 
            descricao: "Processo seletivo para desenvolvedores",
            empresaId: empresa1.id 
        });
        
        const processo2 = await ProcessoSeletivo.create({ 
            nome: 2002, 
            data_inicio: "2023-05-15", 
            data_final: "2023-07-15", 
            descricao: "Processo seletivo para enfermeiros",
            empresaId: empresa2.id 
        });

        // Criando Etapas
        const etapa1 = await Etapa.create({ 
            nome: "Entrevista Inicial", 
            descricao: "Entrevista inicial com RH", 
            tipo: "ENTREVISTA", 
            status_Etapa: "PENDENTE", 
            max_candidatos: 20,
            processoSeletivoId: processo1.id 
        });
        
        const etapa2 = await Etapa.create({ 
            nome: "Teste Técnico", 
            descricao: "Teste de habilidades técnicas", 
            tipo: "TESTE_PRATICO", 
            status_Etapa: "PENDENTE", 
            max_candidatos: 10,
            processoSeletivoId: processo1.id 
        });

        // Criando Vagas
        const vaga1 = await Vaga.create({ 
            cargo: "Desenvolvedor Full Stack", 
            carga_horaria: 40, 
            remuneracao: 5000.00, 
            turno: "MATUTINO", 
            nivel_escolaridade: "GRADUACAO", 
            modalidade: "presencial",
            processoSeletivoId: processo1.id,
            areaId: area1.id 
        });
        
        const vaga2 = await Vaga.create({ 
            cargo: "Enfermeiro", 
            carga_horaria: 30, 
            remuneracao: 3500.00, 
            turno: "NOTURNO", 
            nivel_escolaridade: "GRADUACAO", 
            modalidade: "presencial",
            processoSeletivoId: processo2.id,
            areaId: area2.id 
        });

        // --- INÍCIO: DADOS PARA TESTAR ERRO DE CONCLUSÃO DE PROCESSO SELETIVO ---
        // Usaremos empresa1 e area1 já existentes para este teste.

        const processoErroConclusao = await ProcessoSeletivo.create({ 
            nome: 99999, // Nome numérico distinto para fácil identificação
            data_inicio: "2026-01-01", 
            data_final: "2026-02-28", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99999) para testar erro de conclusão: Etapa Pendente e Vaga Não Preenchida.",
            empresaId: empresa1.id // Assumindo que empresa1 está disponível no escopo
        });
        console.log(`>>> Processo Seletivo '99999' (Combined Error Test) CREATED WITH ID: ${processoErroConclusao.id} <<<`);

        const etapaNaoConcluidaParaTeste = await Etapa.create({ 
            nome: "Etapa de Teste (Não Concluída)", 
            descricao: "Esta etapa permanecerá pendente para o teste de erro de conclusão do Processo Seletivo 99999.", 
            tipo: "ENTREVISTA", // Conforme padrão de outras etapas
            status_Etapa: "PENDENTE", 
            max_candidatos: 5, // Exemplo
            processoSeletivoId: processoErroConclusao.id 
        });
        
        const vagaNaoPreenchidaParaTeste = await Vaga.create({ 
            cargo: "Cargo de Teste (Vaga Não Preenchida)", 
            descricao: "Esta vaga não terá candidatos selecionados para o teste de erro de conclusão do Processo Seletivo 99999.",
            quantidade: 1,
            carga_horaria: 40, // Conforme padrão de outras vagas
            remuneracao: 3000.00, // Exemplo
            turno: "INTEGRAL", // Exemplo, ajuste se necessário
            nivel_escolaridade: "SUPERIOR_COMPLETO", // Exemplo, ajuste conforme ENUMs do seu modelo
            modalidade: "presencial",
            processoSeletivoId: processoErroConclusao.id,
            areaId: area1.id // Assumindo que area1 está disponível no escopo
        });

        // Não é necessário criar Candidaturas selecionadas para 'vagaNaoPreenchidaParaTeste'
        // para que a condição de "vaga não preenchida" seja atendida.

        // --- FIM: DADOS PARA TESTAR ERRO DE CONCLUSÃO DE PROCESSO SELETIVO ---

        // --- INÍCIO: DADOS PARA TESTAR REGRA "ETAPAS NÃO CONCLUÍDAS" ---
        const processoTesteEtapasPendentes = await ProcessoSeletivo.create({ 
            nome: "99998", 
            data_inicio: "2026-03-01", 
            data_final: "2026-04-30", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99998) para testar erro: Etapas Não Concluídas.",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99998' (Etapas Pendentes Test) CREATED WITH ID: ${processoTesteEtapasPendentes.id} <<<`);

        // Etapa PENDENTE para este processo
        await Etapa.create({ 
            nome: "Etapa de Teste (Pendente para 99998)", 
            descricao: "Esta etapa permanecerá pendente para o teste.", 
            tipo: "TESTE_PRATICO", 
            status_Etapa: "PENDENTE", 
            max_candidatos: 5,
            processoSeletivoId: processoTesteEtapasPendentes.id 
        });

        // Vaga para este processo (deve estar preenchida para isolar a regra da etapa)
        const vagaParaTesteEtapa = await Vaga.create({ 
            cargo: "Cargo de Teste (Vaga Preenchida para 99998)", 
            descricao: "Esta vaga será preenchida para o teste de etapas pendentes.",
            quantidade: 1,
            carga_horaria: 40, 
            remuneracao: 3100.00, 
            turno: "INTEGRAL", 
            nivel_escolaridade: "SUPERIOR_COMPLETO", 
            modalidade: "presencial", 
            processoSeletivoId: processoTesteEtapasPendentes.id,
            areaId: area1.id 
        });

        // Candidato e Candidatura para preencher a vagaParaTesteEtapa
        const candidatoTesteEtapa = await Candidato.create({ 
            nome: "Candidato Teste Etapa", 
            cpf: "101.102.103-04", 
            email: "candidato.etapa@teste.com", 
            telefone: "27999001122", 
            data_nascimento: "1991-01-01",
            curso: "SIS_INFORMACAO",
            turno: "MATUTINO",
            numCasa: 111,
            complemento: "Apto 1",
            bairroId: bairro1.id 
        });
        await Candidatura.create({ 
            candidatoId: candidatoTesteEtapa.id,
            vagaId: vagaParaTesteEtapa.id,
            data: "2026-03-05",
            dados_atualizados: true,
            selecionado: true 
        });
        // --- FIM: DADOS PARA TESTAR REGRA "ETAPAS NÃO CONCLUÍDAS" ---


        // --- INÍCIO: DADOS PARA TESTAR REGRA "VAGAS NÃO TOTALMENTE PREENCHIDAS" ---
        const processoTesteVagasNaoPreenchidas = await ProcessoSeletivo.create({ 
            nome: "99997", 
            data_inicio: "2026-05-01", 
            data_final: "2026-06-30", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99997) para testar erro: Vagas Não Totalmente Preenchidas.",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99997' (Vagas Não Preenchidas Test) CREATED WITH ID: ${processoTesteVagasNaoPreenchidas.id} <<<`);

        // Etapa CONCLUÍDA para este processo (para isolar a regra da vaga)
        await Etapa.create({ 
            nome: "Etapa de Teste (Concluída para 99997)", 
            descricao: "Esta etapa estará concluída para o teste de vagas não preenchidas.", 
            tipo: "ENTREVISTA", 
            status_Etapa: "CONCLUIDO", 
            max_candidatos: 5,
            processoSeletivoId: processoTesteVagasNaoPreenchidas.id 
        });

        // Vaga para este processo (NÃO totalmente preenchida)
        const vagaNaoTotalmentePreenchidaTeste = await Vaga.create({ 
            cargo: "Cargo de Teste (Vaga Não Totalmente Preenchida para 99997)", 
            descricao: "Esta vaga terá quantidade 2, mas apenas 1 selecionado.",
            quantidade: 2, 
            carga_horaria: 30, 
            remuneracao: 3200.00, 
            turno: "VESPERTINO", 
            nivel_escolaridade: "SUPERIOR_COMPLETO", 
            modalidade: "semi-presencial", 
            processoSeletivoId: processoTesteVagasNaoPreenchidas.id,
            areaId: area1.id 
        });

        // Candidato e Candidatura para preencher PARCIALMENTE a vagaNaoTotalmentePreenchidaTeste
        const candidatoTesteVaga1 = await Candidato.create({ 
            nome: "Candidato Teste Vaga 1", 
            cpf: "201.202.203-04", 
            email: "candidato.vaga1@teste.com", 
            telefone: "27999112233", 
            data_nascimento: "1992-02-02",
            curso: "ADMINISTRACAO",
            turno: "NOTURNO",
            numCasa: 222,
            complemento: "Apto 2",
            bairroId: bairro2.id 
        });
        await Candidatura.create({ 
            candidatoId: candidatoTesteVaga1.id,
            vagaId: vagaNaoTotalmentePreenchidaTeste.id,
            data: "2026-05-05",
            dados_atualizados: true,
            selecionado: true 
        });
        // --- FIM: DADOS PARA TESTAR REGRA "VAGAS NÃO TOTALMENTE PREENCHIDAS" ---

        // --- INÍCIO: NOVOS CANDIDATOS PARA DIVERSOS TESTES ---
        const candidato3_SisInfoVesp = await Candidato.create({ 
            nome: "Carlos Pereira", 
            cpf: "301.302.303-04", 
            email: "carlos.vesp@teste.com", 
            telefone: "27999223344", 
            data_nascimento: "1993-03-03",
            curso: "SIS_INFORMACAO",
            turno: "VESPERTINO",
            numCasa: 333,
            complemento: "Apto 3",
            bairroId: bairro1.id 
        });

        const candidato4_DireitoMat = await Candidato.create({ 
            nome: "Ana Souza", 
            cpf: "401.402.403-05", 
            email: "ana.direito@teste.com", 
            telefone: "27999334455", 
            data_nascimento: "1994-04-04",
            curso: "DIREITO",
            turno: "MATUTINO",
            numCasa: 444,
            complemento: "Casa B",
            bairroId: bairro2.id 
        });

        const candidato5_MaxInteresses = await Candidato.create({ 
            nome: "Lucas Mendes", 
            cpf: "501.502.503-06", 
            email: "lucas.maxint@teste.com", 
            telefone: "27999445566", 
            data_nascimento: "1995-05-05",
            curso: "ADMINISTRACAO",
            turno: "NOTURNO",
            numCasa: 555,
            complemento: "Bloco C",
            bairroId: bairro1.id 
        });
        // --- FIM: NOVOS CANDIDATOS PARA DIVERSOS TESTES ---

        // --- INÍCIO: NOVA ÁREA PARA TESTES DE INTERESSE ---
        const area3_Admin = await Area.create({ 
            nome: "Administração Geral", 
            descricao: "Área de administração de empresas", 
            curso: "ADMINISTRACAO", 
            candidatos_vaga: 4 
        });
        // --- FIM: NOVA ÁREA PARA TESTES DE INTERESSE ---

        // --- INÍCIO: DADOS PARA TESTAR CONCLUSÃO COM SUCESSO DE PROCESSO SELETIVO (99996) ---
        const processoSucessoConclusao = await ProcessoSeletivo.create({ 
            nome: 99996, 
            data_inicio: "2026-07-01", 
            data_final: "2026-08-31", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99996) para testar conclusão com sucesso.",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99996' (Sucesso Conclusão Test) CREATED WITH ID: ${processoSucessoConclusao.id} <<<`);

        await Etapa.create({ 
            nome: "Etapa Concluída (para 99996)", 
            descricao: "Etapa concluída para teste de sucesso.", 
            tipo: "ENTREVISTA", 
            status_Etapa: "CONCLUIDO", 
            max_candidatos: 5,
            processoSeletivoId: processoSucessoConclusao.id 
        });

        const vagaParaSucessoConclusao = await Vaga.create({ 
            cargo: "Cargo de Teste (Sucesso para 99996)", 
            descricao: "Vaga será preenchida para teste de sucesso.",
            quantidade: 1,
            carga_horaria: 40, 
            remuneracao: 3300.00, 
            turno: "MATUTINO",
            nivel_escolaridade: "SUPERIOR_COMPLETO", 
            modalidade: "presencial", 
            processoSeletivoId: processoSucessoConclusao.id,
            areaId: area1.id
        });

        await Candidatura.create({ 
            candidatoId: candidato1.id,
            vagaId: vagaParaSucessoConclusao.id,
            data: "2026-07-05",
            dados_atualizados: true,
            selecionado: true 
        });
        // --- FIM: DADOS PARA TESTAR CONCLUSÃO COM SUCESSO DE PROCESSO SELETIVO (99996) ---

        // --- INÍCIO: DADOS PARA PROCESSO SELETIVO CANCELADO (99995) ---
        const processoCancelado = await ProcessoSeletivo.create({ 
            nome: 99995, 
            data_inicio: "2026-09-01", 
            data_final: "2026-10-31", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99995) que será cancelado.",
            status: "CANCELADO",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99995' (Cancelado Test) CREATED WITH ID: ${processoCancelado.id} <<<`);
        // --- FIM: DADOS PARA PROCESSO SELETIVO CANCELADO (99995) ---

        // --- INÍCIO: DADOS PARA PROCESSO SELETIVO SEM ETAPAS (99994) ---
        const processoSemEtapas = await ProcessoSeletivo.create({ 
            nome: 99994, 
            data_inicio: "2026-11-01", 
            data_final: "2026-12-31", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99994) sem etapas definidas.",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99994' (Sem Etapas Test) CREATED WITH ID: ${processoSemEtapas.id} <<<`);

        await Vaga.create({ 
            cargo: "Cargo de Teste (Sem Etapas para 99994)", 
            descricao: "Vaga em processo sem etapas.",
            quantidade: 1,
            carga_horaria: 20, 
            remuneracao: 2000.00, 
            turno: "VESPERTINO", 
            nivel_escolaridade: "MEDIO_COMPLETO", 
            modalidade: "à distância", 
            processoSeletivoId: processoSemEtapas.id,
            areaId: area1.id 
        });
        // --- FIM: DADOS PARA PROCESSO SELETIVO SEM ETAPAS (99994) ---

        // --- INÍCIO: DADOS PARA PROCESSO SELETIVO SEM VAGAS (99993) ---
        const processoSemVagas = await ProcessoSeletivo.create({ 
            nome: 99993, 
            data_inicio: "2027-01-01", 
            data_final: "2027-02-28", 
            descricao: "Processo Seletivo (Nome/ID de Teste: 99993) sem vagas definidas.",
            empresaId: empresa1.id 
        });
        console.log(`>>> Processo Seletivo '99993' (Sem Vagas Test) CREATED WITH ID: ${processoSemVagas.id} <<<`);

        await Etapa.create({ 
            nome: "Etapa Genérica (Sem Vagas para 99993)", 
            descricao: "Etapa em processo sem vagas.", 
            tipo: "DINAMICA", 
            status_Etapa: "PENDENTE", 
            max_candidatos: 10,
            processoSeletivoId: processoSemVagas.id 
        });
        // --- FIM: DADOS PARA PROCESSO SELETIVO SEM VAGAS (99993) ---

        // --- INÍCIO: DADOS PARA TESTAR REGRA "MAX 2 INTERESSES POR CANDIDATO" E "CURSO MISMATCH" ---
        const area4_Admin_Alt = await Area.create({ 
            nome: "Administração Específica", 
            descricao: "Outra área de administração", 
            curso: "ADMINISTRACAO", 
            candidatos_vaga: 2 
        });

        await Interesse.create({ 
            candidatoId: candidato5_MaxInteresses.id,
            areaId: area3_Admin.id,
            data_Inicio: "2027-03-01",
            data_Final: "2027-04-01"
        });
        await Interesse.create({ 
            candidatoId: candidato5_MaxInteresses.id,
            areaId: area4_Admin_Alt.id,
            data_Inicio: "2027-03-05",
            data_Final: "2027-04-05"
        });
        // --- FIM: DADOS PARA TESTAR REGRA "MAX 2 INTERESSES POR CANDIDATO" E "CURSO MISMATCH" ---

        // --- INÍCIO: DADOS PARA TESTAR REGRA "CANDIDATURA ÚNICA POR PROCESSO SELETIVO" ---
        const vaga1_aux_PS1 = await Vaga.create({ 
            cargo: "Desenvolvedor Backend Aux", 
            carga_horaria: 40, 
            remuneracao: 4800.00, 
            turno: "MATUTINO",
            nivel_escolaridade: "GRADUACAO", 
            modalidade: "presencial",
            processoSeletivoId: processo1.id,
            areaId: area1.id
        });
        // --- FIM: DADOS PARA TESTAR REGRA "CANDIDATURA ÚNICA POR PROCESSO SELETIVO" ---

        // Criando Interesses
        const interesse1 = await Interesse.create({ 
            candidatoId: candidato1.id,
            areaId: area1.id,
            data_Inicio: "2023-04-01",
            data_Final: "2023-05-01"
        });
        
        const interesse2 = await Interesse.create({ 
            candidatoId: candidato2.id,
            areaId: area2.id,
            data_Inicio: "2023-04-15",
            data_Final: "2023-05-15"
        });

        // Criando Candidaturas
        const candidatura1 = await Candidatura.create({ 
            candidatoId: candidato1.id,
            vagaId: vaga1.id,
            data: "2023-05-10",
            dados_atualizados: true,
            selecionado: false
        });
        
        const candidatura2 = await Candidatura.create({ 
            candidatoId: candidato2.id,
            vagaId: vaga2.id,
            data: "2023-05-20",
            dados_atualizados: true,
            selecionado: true
        });

        // Criando Usuários
        const admin = await Usuario.create({
            nome: "Administrador",
            email: "admin@sistema.com",
            senha: "123456",
            perfil: "ADMIN"
        });

        const usuario = await Usuario.create({
            nome: "Usuário Padrão",
            email: "usuario@sistema.com",
            senha: "123456",
            perfil: "USUARIO"
        });
    })();
}

export default sequelize;