const express = require('express');
const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')

const server = express();
const middleware = [express.json(), logger]

server.use(middleware);
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`req.method: ${req.method}, req.url: ${req.url}, timestamp: ${new Date().toISOString()} `);
  next();
}

module.exports = server;
