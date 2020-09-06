'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000 ;
const superAgent = require('superagent');
const app = express();

app.use(express.static('./public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('pages/index');
})

app.listen(PORT,()=>{
    console.log(`sever is up: PORT ${PORT}`);
})