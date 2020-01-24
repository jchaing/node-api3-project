const express = require('express');

const server = express();
const middleware = [express.json(), logger]

server.use(middleware);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`req.method: ${req.method}, req.url: ${req.url}, timestamp: ${new Date().toISOString()} `);
  next();
}

module.exports = server;
