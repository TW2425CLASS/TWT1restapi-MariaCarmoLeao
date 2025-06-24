const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  anoCurricular: Number,
  curso: String
});

module.exports = mongoose.model('Aluno', alunoSchema, 'alunos');
