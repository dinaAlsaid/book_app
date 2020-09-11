'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const superAgent = require('superagent');
const app = express();
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverRide = require('method-override');
app.use(methodOverRide('_method'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.static('./public/styles'));

app.get('/', mainRouteHandler);
app.get('/searches/new', searchesNewHandler);
app.post('/searches/show', searchesShowHandler);
app.get('/book/:id', viewBook);
app.post('/books', addBook);
app.put('/updateBook/:bookId',UpdateBookHandler);
app.delete('/deleteBook/:bookId', deleteBookHandler);
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
  let bookId = req.params.id;
  let safeValues = [bookId];
  let sql = 'SELECT * FROM books WHERE id=($1);'
  let SQL2 ='SELECT DISTINCT categories FROM books';
  let categArr=[];
  client.query(sql, safeValues).then((results) => {
    client.query(SQL2).then((category)=>{
      categArr = categArr.concat(category.rows.map((item)=>{
        return item.categories;
      }));
      console.log(categArr);
      res.render('pages/books/detail', { categ: categArr, book: results.rows[0]  })

    })
  })
    .catch(error => {
      errorHandler(req, res)
    })
}

function searchesShowHandler(req, res) {
  let book = req.body.hamza;
  let titleOrAuthor = req.body.titleOrAuthor;
  let url = `https://www.googleapis.com/books/v1/volumes?q=+${titleOrAuthor}:${book}`;
  superAgent.get(url)
    .then(result => {
      let bookArray = result.body.items.map(book => {

        return new BookWiki(book);
      });
      res.render('pages/searches/show', { bookArr: bookArray }); /*Render 10 books as Array-of-objects. |-----| If map was empty it will give us 10 null objects*/
    })
    // .catch(error => {
    //   errorHandler(req, res)
    // })

}

function UpdateBookHandler(req,res){
  let {author,title,isbn,description,categories} = req.body;
  let bookID=req.params.bookId;
  let SQL = 'UPDATE books SET author=$1,title=$2,isbn=$3,description=$4,categories=$5 WHERE id=$6;'
  let safeValues=[author,title,isbn,description,categories,bookID];
  console.log(req.body);

  client.query(SQL,safeValues)
  .then(()=>{
    res.redirect(`/book/${bookID}`);
  })
}

function deleteBookHandler(req,res){
  let SQL ='DELETE FROM books WHERE id=$1;'
  let safeValues=[req.params.bookId];

  client.query(SQL,safeValues).then(()=>{
    res.redirect('/');
  })
}

function errorHandler(request, response) {
  response.render('pages/error')
}

//constructor
function BookWiki(data) {
  this.Book_Title = data.volumeInfo.title? data.volumeInfo.title: 'no title';
  this.Author_Name = data.volumeInfo.authors? data.volumeInfo.authors : 'no author';
  this.Description = data.volumeInfo.description? data.volumeInfo.description : 'no discreption avaialble';
  this.Image = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.smallThumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.isbn = data.volumeInfo.industryIdentifiers[0].identifier? 'ISBN_13 ' + data.volumeInfo.industryIdentifiers[0].identifier : 'no isbn';
  this.categories = data.volumeInfo.categories? data.volumeInfo.categories : 'no categories';


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



