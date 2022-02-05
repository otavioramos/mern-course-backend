const express = require('express');

const app = express();

app.listen(5001);
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Hello again');
});