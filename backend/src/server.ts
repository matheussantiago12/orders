import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    res.send('Teste');
});

app.listen(3030);
