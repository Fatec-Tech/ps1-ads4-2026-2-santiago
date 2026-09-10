const pacientes = [];
const pacientesArquivo = [];
const pacientesManuais = [];

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');

function adicionarPaciente(nome, email, nascimento) {
	pacientes.push({ nome, email, nascimento });
}

function renderizarTabela() {
	tabela.innerHTML = '';

	  if (pacientes.length === 0) {
    tabela.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">Nenhum paciente cadastrado ainda</td>
      </tr>
    `;
    return;
  }

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');
		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
    `;
		tabela.appendChild(linha);
	});
}

function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

const resumoPacientes = document.getElementById('resumo-pacientes');

function atualizarResumo() {
  resumoPacientes.textContent =
    `Pacientes do arquivo: ${pacientesArquivo.length} | Cadastrados na sessão: ${pacientesManuais.length}`;
}

// Nova função: busca os pacientes iniciais a partir do arquivo JSON
async function carregarPacientesIniciais() {
	try {
		// simular atraso
    	mensagemCarregando.textContent = 'Carregando pacientes...';

    	await new Promise((resolve) => {
      	setTimeout(resolve, 1000);
    	});

		const resposta = await fetch('data/pacientes.json');
		console.log(resposta);

		// Nem toda resposta é sucesso — precisamos checar antes de usar
		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}

		const dados = await resposta.json(); // converte a resposta em objeto JS

		// Adiciona cada paciente vindo do arquivo ao nosso array local
		dados.forEach((paciente) => {
  			const pacienteArquivo = {
    			nome: paciente.nome,
    			email: paciente.email,
    			nascimento: paciente.nascimento,
    			origem: 'arquivo'
  			};

  				pacientesArquivo.push(pacienteArquivo);
  				pacientes.push(pacienteArquivo);
			});

			renderizarTabela();
			atualizarResumo();
	} catch (erro) {
  console.error('Não foi possível carregar os pacientes:', erro);

  mensagemCarregando.textContent =
    'Erro ao carregar pacientes. Tente novamente mais tarde.';

  tabela.innerHTML = `
    <tr>
      <td colspan="3" class="text-center text-danger">
        Não foi possível carregar os pacientes.
      </td>
    </tr>
  `;	return; // sai da função sem esconder a mensagem de erro
	}

	mensagemCarregando.textContent =
		'Dados carregados com sucesso.';
	// mensagemCarregando.style.display = 'none'; // esconde "Carregando..." em caso de sucesso
}

formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;

	const novoPaciente = {
    nome,
    email,
    nascimento,
    origem: 'manual'
  };

  pacientesManuais.push(novoPaciente);
  pacientes.push(novoPaciente);

  renderizarTabela();
  atualizarResumo();

  formulario.reset();
});

// Assim que o script carrega, já dispara a busca dos dados iniciais
carregarPacientesIniciais();
