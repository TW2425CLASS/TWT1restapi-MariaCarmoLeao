const Curso = require('../models/curso.model');

exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find(); 
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter cursos' });
  }
};