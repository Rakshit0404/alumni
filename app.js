const express=require('express');
const path = require('path');
const app=express();
const ejsmate=require('ejs-mate');

//middelware
app.engine('ejs',ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'views/layouts')));

app.get('/',(req,res)=>{
    // res.send("<h1>home page</h1>");
    res.render('layouts/home')
})

app.get('/contactus',(req,res)=>{
    res.render("alumni/contactus")
})

app.listen('3000',()=>{
console.log("listening to port 3000");
})