const express = require('express');
const path = require('path');
const http = require('http');

const port = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .get('/', (req, res) => res.sendFile('index.html', {root: __dirname}))
    .listen(port, () => console.log(`Listening on ${port}`));

// keep alive ping
if (process.env.WAKE_URL && process.env.WAKE_MS) {
    const wakeUp = () => http.get(process.env.WAKE_URL);
    setInterval(wakeUp, process.env.WAKE_MS);
}