const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  instituicao: { 
    type: String, 
    required: true, 
    match: /^[A-Z]{2,4}$/ 
  },
  numCurricular: { type: Number, required: true }
});

module.exports = mongoose.model('Curso', cursoSchema);