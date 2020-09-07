'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const superAgent = require('superagent');
const app = express();
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL);


app.use(express.static('./public'));
app.use(express.static('./public/styles'));

app.set('view engine', 'ejs');

app.use(express.urlencoded());

/*Main route*/
app.get('/', (req, res) => {
  // res.status(200).send('work on main route');
  let sql = `SELECT * FROM books;`
  client.query(sql)
  .then(results => {
    console.log(results.rows);
    res.render('pages/index',{savedArr:results.rows})
  })
  .catch(error => console.log(error))
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

app.get('/books',(req,res) => {
  console.log(req.body);
})

/*Render the data from the form */
app.post('/searches/show', (req, res) => {
  /*body for post -- get for query */
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
    errorHandler(req, res)})

});


// let allBook = [];
function BookWiki(data) {
  this.Book_Title = data.volumeInfo.title;
  this.Author_Name = data.volumeInfo.authors;
  this.Description = data.volumeInfo.description;
  this.Image = this.protocol(data.volumeInfo.imageLinks.smallThumbnail) || `https://i.imgur.com/J5LVHEL.jpg`;
  this.isbn = 'ISBN_13 ' + data.volumeInfo.industryIdentifiers[0].identifier
  this.categories = data.volumeInfo.categories

  // BookWiki.push(this);
}
/*If image has http retrun https */
BookWiki.prototype.protocol = function (link) {
  let imageLink = link;
  if (imageLink.slice(0, 5) !== 'https') {
    imageLink = 'https' + imageLink.slice(4);
  }
  return imageLink;
};


function errorHandler(request, response) {
  response.render('pages/error')
}



client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })



app.use(errorHandler)
