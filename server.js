'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const superAgent = require('superagent');
const app = express();
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.static('./public/styles'));

app.get('/', mainRouteHandler);
app.get('/searches/new', searchesNewHandler);
app.post('/searches/show', searchesShowHandler);
app.get('/book/:id', viewBook);
app.post('/books', addBook);
app.use(errorHandler);



// call back functions

function mainRouteHandler(req, res) {
  let sql = `SELECT * FROM books;`
  client.query(sql)
    .then(results => {
      res.render('pages/index', { savedArr: results.rows })
    })
    .catch(error => {
      errorHandler(req, res)
    })
}

function addBook(req,res) {
  let {image,title, author, desc, isbn, categories} = req.body;
  let SQL = `INSERT INTO books (author,title,isbn,image_url,description,categories) VALUES ($1,$2,$3,$4,$5,$6);`;
  let safeValues = [author,title,isbn,image,desc,categories];
  client.query(SQL,safeValues)
  .then (() => {
    res.redirect('/')
  })

}

function searchesNewHandler(req, res) {
  res.render('pages/searches/new');
}

function viewBook(req, res) {
  console.log('here');
  console.log(req.params);
  let bookId = req.params.id;
  let safeValues = [bookId];
  let sql = 'SELECT * FROM books WHERE id=($1);'

  client.query(sql, safeValues).then((results) => {
    console.log(results.rows[0]);
    res.render('pages/books/detail', { book: results.rows[0] })
  })
    .catch(error => {
      console.log('error');
      errorHandler(req, res)
    })
}

function searchesShowHandler(req, res) {
  let book = req.body.hamza;
  let titleOrAuthor = req.body.titleOrAuthor;
  let url = `https://www.googleapis.com/books/v1/volumes?q=${book}+${titleOrAuthor}:${book}`;

  superAgent.get(url)
    .then(result => {
      let bookArray = result.body.items.map(book => {
        return new BookWiki(book);
      });
      res.render('pages/searches/show', { bookArr: bookArray }); /*Render 10 books as Array-of-objects. |-----| If map was empty it will give us 10 null objects*/
    })
    .catch(error => {
      errorHandler(req, res)
    })

}

function errorHandler(request, response) {
  response.render('pages/error')
}

//constructor
function BookWiki(data) {
  this.Book_Title = data.volumeInfo.title;
  this.Author_Name = data.volumeInfo.authors;
  this.Description = data.volumeInfo.description;
  this.Image = this.protocol(data.volumeInfo.imageLinks.smallThumbnail) || `https://i.imgur.com/J5LVHEL.jpg`;
  this.isbn = 'ISBN_13 ' + data.volumeInfo.industryIdentifiers[0].identifier
  this.categories = data.volumeInfo.categories

}
/*If image has http retrun https */
BookWiki.prototype.protocol = function (link) {
  let imageLink = link;
  if (imageLink.slice(0, 5) !== 'https') {
    imageLink = 'https' + imageLink.slice(4);
  }
  return imageLink;
};


client.connect()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  })



