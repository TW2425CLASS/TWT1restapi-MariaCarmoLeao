const apiUrl = 'https://twt1restapi-mariacarmoleao-4.onrender.com/alunos';
const cursosUrl = 'https://twt1restapi-mariacarmoleao-4.onrender.com/cursos';

const listaAlunos = document.getElementById('listaAlunos');
const form = document.getElementById('alunoForm');
const nomeInput = document.getElementById('nome');
const apelidoInput = document.getElementById('apelido');
const anoCurricularInput = document.getElementById('anoCurricular');
const cursoInput = document.getElementById('curso');
const mensagemDiv = document.getElementById('mensagem');

let alunoEditandoId = null;

// Mostrar mensagens de feedback
function mostrarMensagem(texto, cor = 'green') {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = cor;
  setTimeout(() => mensagemDiv.textContent = '', 3000);
}

async function carregarAlunos() {
  listaAlunos.innerHTML = '';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Erro ao buscar alunos: ${res.status} ${res.statusText}`);
    }
    const alunos = await res.json();
    alunos.forEach(aluno => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${aluno.nome} ${aluno.apelido} - ${aluno.curso} (${aluno.anoCurricular}º ano)</span>
        <button onclick="removerAluno('${aluno._id}')">Remover</button>
        <button onclick="editarAluno('${aluno._id}')">Editar</button>
      `;
      listaAlunos.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    listaAlunos.innerHTML = '<li>Erro ao carregar alunos.</li>';
  }
}

// Carregar lista de cursos
async function carregarCursos() {
  try {
    const res = await fetch(cursosUrl);
    if (!res.ok) {
      throw new Error(`Erro na resposta: ${res.status}`);
    }
    const cursos = await res.json();
    const selectCurso = document.getElementById('curso');
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso.nome;
      option.textContent = curso.nome;
      selectCurso.appendChild(option);
    });
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
  }
}

// Submeter novo aluno
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const alunoData = {
    nome: nomeInput.value.trim(),
    apelido: apelidoInput.value.trim(),
    anoCurricular: anoCurricularInput.value.trim(),
    curso: cursoInput.value
  };

  if (!alunoData.nome || !alunoData.apelido || !alunoData.anoCurricular || !alunoData.curso) {
    mostrarMensagem('Por favor preencha todos os campos', 'red');
    return;
  }

  try {
    if (alunoEditandoId) {
      // Atualizar aluno existente
      const res = await fetch(`${apiUrl}/${alunoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
      if (res.ok) {
        mostrarMensagem('Aluno atualizado com sucesso', 'green');
        form.reset();
        alunoEditandoId = null;
        form.querySelector('button[type="submit"]').textContent = 'Adicionar Aluno';
        carregarAlunos();
      } else {
        mostrarMensagem('Erro ao atualizar aluno', 'red');
      }
    } else {
      // Adicionar novo aluno
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData),
      });
      if (res.status === 409) {
        mostrarMensagem('Aluno já existente', 'red');
      } else if (res.ok) {
        mostrarMensagem('Aluno adicionado com sucesso', 'green');
        form.reset();
        carregarAlunos();
      } else {
        mostrarMensagem('Erro ao adicionar aluno', 'red');
      }
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro na comunicação com o servidor', 'red');
  }
});

// Remover aluno
async function removerAluno(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao remover aluno: ${res.status}`);
    }
    carregarAlunos();
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao remover aluno', 'red');
  }
}

// Função para editar aluno
async function editarAluno(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar aluno');
    const aluno = await res.json();
    nomeInput.value = aluno.nome;
    apelidoInput.value = aluno.apelido;
    anoCurricularInput.value = aluno.anoCurricular;
    cursoInput.value = aluno.curso;
    alunoEditandoId = id;
    form.querySelector('button[type="submit"]').textContent = 'Guardar Alterações';
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao carregar dados do aluno', 'red');
  }
}

// Inicializar
carregarAlunos();
carregarCursos();