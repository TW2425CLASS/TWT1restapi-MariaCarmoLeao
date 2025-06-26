const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/curso.controller');

router.get('/', cursoController.getCursos);
router.post('/', cursoController.addCurso);
router.delete('/:id', cursoController.deleteCurso);
router.put('/:id', cursoController.editCurso);
router.get('/:id', cursoController.getCursoById);

module.exports = router;