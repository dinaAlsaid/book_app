'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const superAgent = require('superagent');
const app = express();

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded());

/*Main route*/
app.get('/', (req, res) => {
  // res.status(200).send('work on main route');
  res.render('pages/searches/new');
});

app.get('/main', (req, res) => {
  res.render('pages/index');

});

// app.get('/searches/new',(req,res)=>{
//   res.render('./pages/searches/new');

// });

/*Render the data from the form */
app.post('/searches/show',(req,res)=>{
/*body for post -- get for query */
  let book = req.body.search;
  console.log(book); /*the search we made*/
  // let titleOrAuthor = req.query.titleOrAuthor;
  // console.log(titleOrAuthor);

  let url =  `https://www.googleapis.com/books/v1/volumes?q=${book}+intitle`;

  superAgent.get(url).then(result =>{
    let bookArray = result.body.items.map(book =>{
      return new BookWiki(book);
    });
    res.send(bookArray); /*Render 10 books as Array-of-objects. |-----| If map was empty it will give us 10 null objects*/
  });








  // superAgent.get(url).then(result =>{
  //   let bodyData = result.body.items.map(book =>{
  //     return new BookWiki(book);
  //   });
  //   // console.log(bodyData);
  //   res.render('pages/searches/show',{booksArr: bodyData});
  //   // res.send(bodyData);
  // });

  // console.log(bodyData);
  // res.render('pages/searches/show',{booksArr: bodyData});
});

// console.log(req.body,'req.body');
// console.log(res.body,'res.body');
// console.log(req.query,'req.query');/*Worked*/
// console.log(res.query,'res.query');

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

app.listen(PORT, () => {
  console.log(`sever is up: PORT ${PORT}`);
});
