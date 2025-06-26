const apiUrl = 'https://twt1restapi-mariacarmoleao-4.onrender.com/alunos';
const cursosUrl = 'https://twt1restapi-mariacarmoleao-4.onrender.com/cursos';

const listaAlunos = document.getElementById('listaAlunos');
const firstform = document.getElementById('alunoForm');
const nomeInput = document.getElementById('nome');
const apelidoInput = document.getElementById('apelido');
const anoCurricularInput = document.getElementById('anoCurricular');
const cursoInput = document.getElementById('curso');
const mensagemDiv = document.getElementById('mensagem');

const listaCursos = document.getElementById('listaCursos');
const secondform = document.getElementById('cursoForm');
const nomeCursoInput = document.getElementById('nomecurso');
const instituicaoInput = document.getElementById('instituicao');
const numCurricularInput = document.getElementById('numCurricular');

let alunoEditandoId = null; // Variável para armazenar o ID do aluno que está a ser editado
let cursoEditandoId = null;

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

    const cursosRes = await fetch(cursosUrl);
    if (!cursosRes.ok) {
      throw new Error(`Erro ao buscar cursos: ${cursosRes.status} ${cursosRes.statusText}`);
    }
    // Preencher o dropdown de cursos
    const cursos = await cursosRes.json();
    if (cursos.length === 0) {
      cursoInput.innerHTML = '<option value="">Nenhum curso disponível</option>';
      cursoInput.disabled = true;
      return;
    }
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso._id;
      option.textContent = `${curso.nome} (${curso.instituicao || ''}, ${curso.numCurricular || ''} anos)`;
      cursoInput.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    listaAlunos.innerHTML = '<li>Erro ao carregar alunos.</li>';
  }
}

async function carregarCursos() {
  listaCursos.innerHTML = '';
  try {
    const res = await fetch(cursosUrl);
    if (!res.ok) {
      throw new Error(`Erro ao buscar cursos: ${res.status} ${res.statusText}`);
    }
    const cursos = await res.json();
    cursos.forEach(curso => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${curso.nome} (${curso.instituicao || ''}, ${curso.numCurricular || ''} anos)</span>
        <button onclick="removerCurso('${curso._id}')">Remover</button>
        <button onclick="editarCurso('${curso._id}')">Editar</button>
      `;
      listaCursos.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    listaCursos.innerHTML = '<li>Erro ao carregar cursos.</li>';
  }
}

// Submeter novo aluno
if(firstform !== null) firstform.addEventListener('submit', async (e) => {
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

// Remover curso
async function removerCurso(id) {
  try {
    const res = await fetch(`${cursosUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao remover curso: ${res.status}`);
    }
    carregarCursos();
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao remover curso', 'red');
  }
}

// Editar curso
async function editarCurso(id) {
  try {
    const res = await fetch(`${cursosUrl}/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar curso');
    const curso = await res.json();
    nomeCursoInput.value = curso.nome;
    instituicaoInput.value = curso.instituicao || '';
    numCurricularInput.value = curso.numCurricular || '';
    cursoEditandoId = id;
    secondform.querySelector('button[type="submit"]').textContent = 'Guardar Alterações';
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao carregar dados do curso', 'red');
  }
}

// Submeter novo curso
if(secondform !== null) secondform.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cursoData = {
    nome: nomeCursoInput.value.trim(),
    instituicao: instituicaoInput.value.trim(),
    numCurricular: numCurricularInput.value.trim()
  };

  if (!cursoData.nome || !cursoData.instituicao || !cursoData.numCurricular) {
    mostrarMensagem('Por favor preencha todos os campos do curso', 'red');
    return;
  }

  try {
    if (cursoEditandoId) {
      // Atualizar curso existente
      const res = await fetch(`${cursosUrl}/${cursoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
      });
      if (res.ok) {
        mostrarMensagem('Curso atualizado com sucesso', 'green');
        secondform.reset();
        cursoEditandoId = null;
        secondform.querySelector('button[type="submit"]').textContent = 'Adicionar Curso';
        carregarCursos();
      } else {
        mostrarMensagem('Erro ao atualizar curso', 'red');
      }
    } else {
      // Adicionar novo curso
      const res = await fetch(cursosUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
      });
      if (res.status === 409) {
        mostrarMensagem('Curso já existente', 'red');
      } else if (res.ok) {
        mostrarMensagem('Curso adicionado com sucesso', 'green');
        secondform.reset();
        carregarCursos();
      } else {
        mostrarMensagem('Erro ao adicionar curso', 'red');
      }
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro na comunicação com o servidor', 'red');
  }
});

// Inicializar
carregarAlunos();
carregarCursos();