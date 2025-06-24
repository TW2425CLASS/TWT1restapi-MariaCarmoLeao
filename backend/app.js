const express = require('express');
const mongoose = require('mongoose');
const alunoRoutes = require('./routes/alunos.routes');
const cursoRoutes = require('./routes/cursos.routes');

const app = express();

app.use(express.json());

// Conexão à base de dados MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);

module.exports = app;

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});