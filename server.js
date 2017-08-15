var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');

// mongodb host
var db = 'mongodb://localhost:27017/schemaExample';

// connect to mongodb
mongoose.connect(db, {
  useMongoClient: true
});

// setup express
var app = express();
var port = 8080;

// setup body parser for post requests
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/*
 * routes
 */

// GET method route - homepage
app.get('/', (req, res) => {
  res.send('Home page!');
});

// GET method route - return all books
app.get('/books', (req, res) => {
  console.log('Getting all books');
  Book.find({}).exec((err, response) => {
    if (err) {
      res.send('An error occured while getting all books');
    } else {
      res.json(response);
    }
  });
});

// GET method route - return specified books
app.get('/books/:id', (req, res) => {
  console.log('Getting one book');
  console.log(req);
  Book.findOne({
    _id: req.params.id
  }).exec((err, response) => {
    if (err) {
      res.send('An error occured while getting the book');
    } else {
      res.json(response);
    }
  });
});

// POST method route - save a book
app.post('/book', (req, res) => {
  let newBook = new Book();

  newBook.title = req.body.title;
  newBook.author = req.body.author;
  newBook.category = req.body.category;

  newBook.save((err, response) => {
    if (err) {
      res.send('An error occured while saving book');
    } else {
      res.send(response);
    }
  });
});

// PUT method route - update a book field
app.put('/book/:id', (req, res) => {
  Book.findOneAndUpdate(
    {
      _id: req.params.id
    },
    { $set: { title: req.body.title } },
    { upsert: true },
    (err, response) => {
      if (err) {
        res.send('An error occured while updating book');
      } else {
        res.send(response);
      }
    }
  );
});

// DELETE method route - remove book
app.delete('/book/:id', (req, res) => {
  Book.findOneAndRemove(
    {
      _id: req.params.id
    },
    (err, response) => {
      if (err) {
        res.send('An error occured while removing the book');
      } else {
        res.send(response);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running in port ${port}...`);
});
