const express = require('express');
const db = require('./userDb.js');
const posts = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  console.log(req.body);
  db.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'exception', err });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  newPost.user_id = req.user.id;

  console.log(newPost);

  posts.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });

});

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved' }, err);
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.user;
  db.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: 'exception', err });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.user;
  db.remove(id)
    .then(deleted => {
      res.status(200).json(`${deleted} record deleted`);
    })
    .catch(err => {
      res.status(500).json({ message: 'exception', err });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const { id } = req.user;
  const changes = req.body;
  const { name } = req.body;

  db.update(id, changes)
    .then(updated => {
      res.status(200).json({ updated, id, name });
    })
    .catch(err => {
      res.status(500).json({ message: 'exception', err });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  db.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        // next(new Error('does not exist'));
        res.status(400).json({ message: 'invalid user id' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
