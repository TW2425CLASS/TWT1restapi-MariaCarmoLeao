const Curso = require('../models/curso.model');

exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter cursos' });
  }
};

exports.addCurso = async (req, res) => {
  const { nome, instituicao, numCurricular } = req.body;
  // Verifica duplicados
  const existe = await Curso.findOne({ nome, instituicao });
  if (existe) return res.status(409).json({ message: 'Curso já existe' });
  const novoCurso = new Curso({ nome, instituicao, numCurricular });
  await novoCurso.save();
  res.status(201).json(novoCurso);
};

exports.deleteCurso = async (req, res) => {
  const { id } = req.params;
  await Curso.findByIdAndDelete(id);
  res.status(204).end();
};

exports.editCurso = async (req, res) => {
  const { id } = req.params;
  const { nome, instituicao, numCurricular } = req.body;
  try {
    const cursoAtualizado = await Curso.findByIdAndUpdate(
      id,
      { nome, instituicao, numCurricular },
      { new: true, runValidators: true }
    );
    if (!cursoAtualizado) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    res.json(cursoAtualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar curso', error });
  }
};

exports.getCursoById = async (req, res) => {
  const { id } = req.params;
  try {
    const curso = await Curso.findById(id);
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar curso', error });
  }
};