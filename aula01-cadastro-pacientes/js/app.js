// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];
const CHAVE_STORAGE = 'pacientes';
let ordemNome = 1;

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contadorPacientes = document.getElementById('contador-pacientes');
const campoBusca = document.getElementById('busca-paciente');
const cabecalhoNome = document.getElementById('ordenar-nome');

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, telefone, nascimento) {
    const novoPaciente = { nome, email, telefone, nascimento };
    pacientes.push(novoPaciente);
    salvarPacientes();
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar
    const termoBusca = campoBusca.value.toLowerCase();
    const pacientesFiltrados = pacientes.filter((paciente) =>
        paciente.nome.toLowerCase().includes(termoBusca)
    );

    pacientesFiltrados.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.innerHTML = `
		<td>${paciente.nome}</td>
		<td>${paciente.email}</td>
  		<td>${paciente.telefone}</td>
  		<td>${formatarData(paciente.nascimento)}</td>
  		<td>${calcularIdade(paciente.nascimento)}</td>
        <td><button type="button" class="btn btn-danger btn-sm remover-paciente">Remover</button></td>
`;
        linha.querySelector('.remover-paciente').dataset.email = paciente.email;

		tabela.appendChild(linha);
	});

    contadorPacientes.textContent = `Total de pacientes: ${pacientes.length}`;
}


// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
const email = document.getElementById('email').value;
const telefone = document.getElementById('telefone').value;
const nascimento = document.getElementById('nascimento').value;

const emailExiste = pacientes.some(
    (paciente) => paciente.email.toLowerCase() === email.toLowerCase()
);

if (emailExiste) {
    alert('Este e-mail já está cadastrado.');
    return;
}

adicionarPaciente(nome, email, telefone, nascimento);
renderizarTabela();

formulario.reset();
});

function calcularIdade(dataISO) {
    const [ano, mes, dia] = dataISO.split('-').map(Number);
    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;

    const aindaNaoFezAniversario =
        hoje.getMonth() + 1 < mes ||
        (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);

    if (aindaNaoFezAniversario) {
        idade--;
    }

    return idade;
}

function salvarPacientes() {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pacientes));
}

function carregarPacientes() {
    const pacientesSalvos = JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || [];
    pacientes.push(...pacientesSalvos);
}

campoBusca.addEventListener('input', renderizarTabela);

cabecalhoNome.addEventListener('click', () => {
    pacientes.sort((pacienteA, pacienteB) =>
        pacienteA.nome.localeCompare(pacienteB.nome, 'pt-BR') * ordemNome
    );
    ordemNome *= -1;
    salvarPacientes();
    renderizarTabela();
});

tabela.addEventListener('click', (event) => {
    if (!event.target.classList.contains('remover-paciente')) {
        return;
    }

    const email = event.target.dataset.email;
    const indicePaciente = pacientes.findIndex((paciente) => paciente.email === email);

    if (indicePaciente !== -1) {
        pacientes.splice(indicePaciente, 1);
        salvarPacientes();
        renderizarTabela();
    }
});

carregarPacientes();
renderizarTabela();

