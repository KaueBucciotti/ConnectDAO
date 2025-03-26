import express from 'express';
import ConexaoDB from './conexao.js';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Permite requisições de outros domínios (como do frontend)
app.use(express.json()); // Aceita JSON no corpo das requisições
app.use(express.static('public')); // Serve arquivos estáticos da pasta "public"

// Rota para servir o arquivo form.html como página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'form.html')); // Certifique-se de que form.html está na pasta "public"
});

// Rota que busca todos os estudantes
app.get('/student', (req, res) => {
    ConexaoDB.getAllStudents((students) => res.json(students)); // Retorna todos os estudantes
});

// Rota que busca um estudante pelo ID
app.get('/student/:id', (req, res) => {
    ConexaoDB.getStudentById(req.params.id, (student) => {
        if (student.length > 0) {
            res.json(student[0]); // Retorna o estudante encontrado
        } else {
            res.status(404).json({ error: "Estudante não encontrado!" }); // Retorna erro 404 se não encontrado
        }
    });
});

// Rota para cadastrar um novo estudante
app.post('/student', (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios!" });
    }
    ConexaoDB.save(req.body, (student) => res.json(student)); // Salva o estudante no banco
});

// Rota para atualizar um estudante pelo ID
app.put('/student/:id', (req, res) => {
    req.body.id = req.params.id; // Adiciona o ID da URL ao corpo da requisição
    ConexaoDB.update(req.body, (result) => {
        res.json({ success: "Dados atualizados!" }); // Retorna confirmação
    });
});

// Rota para deletar um estudante pelo ID
app.delete('/student/:id', (req, res) => {
    ConexaoDB.deleteById(req.params.id, (result) => {
        if (result.affectedRows > 0) {
            res.json({ success: "Estudante removido!" }); // Confirmação de exclusão
        } else {
            res.status(404).json({ error: "ID não encontrado!" }); // Retorna erro se o ID não existir
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});