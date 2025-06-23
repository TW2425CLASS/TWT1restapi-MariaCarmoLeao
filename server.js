const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const alunosRouter = require('./backend/routes/alunos.routes');
app.use('/alunos', alunosRouter);

const cursosRouter = require('./backend/routes/cursos.routes');
app.use('/cursos', cursosRouter);

mongoose.connect('mongodb+srv://user1:12345@cluster0.d47mvin.mongodb.net/academicos')
  .then(() => console.log('Ligado ao MongoDB'))
  .catch((err) => console.error('Erro ao ligar ao MongoDB:', err));

// Serve frontend estático
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
