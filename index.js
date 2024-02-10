const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware para analisar o corpo do pedido
app.use(express.json());

const SECRET_KEY = "secreto";

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1010") {
        const token = jwt.sign({ username, role: "admin" }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login realizado com sucesso!", token });
    } else if (username === "user" && password === "1010") {
        const token = jwt.sign({ username, role: "user" }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login realizado com sucesso!", token });
    } else {
        res.status(401).json({ message: "Usuário ou senha inválidos!" });
    }
});


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (user.role !== "admin") {
                return res.status(403).json({ message: "Acesso negado!" });
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: "Conteúdo protegido!", user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
