'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const superAgent = require('superagent');
const app = express();

app.use(express.static('./public'));
app.use(express.static('./public/styles'));

app.set('view engine', 'ejs');

app.use(express.urlencoded());

/*Main route*/
app.get('/', (req, res) => {
  // res.status(200).send('work on main route');
  res.render('pages/index');
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});



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



app.listen(PORT, () => {
  console.log(`sever is up: PORT ${PORT}`);
});

app.use(errorHandler)
