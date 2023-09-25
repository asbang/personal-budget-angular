// Budget API

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use('/', express.static('public'));

const budget = require('./budget.json');

app.get('/', (req, res) => {
    res.json("Hello World!");
});

app.get('/budget', (req, res) => {
    console.log(budget);
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Example adxfgxdgdsgrdfpp listening at http://localhost:${port}`);
});