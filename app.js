const express = require("express");
const mongoose = require("mongoose");
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect("mongodb+srv://Arunkumar:Arun%40shroff123@cluster0.ym7ko.mongodb.net/seachdb?retryWrites=true&w=majority", { useNewUrlParser: true })
	.then(() => {
    console.log("Mongo connection open")
  })
  .catch(err => {
    console.log("Mongo connection error")
    console.log(err)
  })    

app.use(express.urlencoded({ extended: true }));  
app.use(session({ secret: 'notagoodsecret' }));

app.get('/signin',(req,res) =>{
  res.render('signin')
})
app.post('/signin',async(req,res) =>{
  const { email , password , remember } = req.body;
  //console.log(req.body)
  const user = await User.findOne({ email });
  const vaildPassword = await bcrypt.compare(password, user.password);
  if (vaildPassword) {
    req.session.user_id = user._id;
    res.redirect('/index')
  }
  else {
    res.send("Email or Password is incorrect please try again")
  }
})

app.get('/signup',(req,res) => {
  res.render('signup')
})

app.post('/signup', async(req,res) => {
  //res.send(req.body)
  const { password, email } = req.body;
  // console.log(req.body)
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hash
  })
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/signin')
  //res.send(hash);
})

app.get('/index',(req,res) => {
  if(!req.session.user_id){
    res.redirect('/signin')
  } else {
  res.render("index")
  }
}) 

app.get('/signout',(req,res)=>{
  console.log("going to signout this page");
})
app.post('/signout',(req,res)=>{
  //req.session.user_id = null;
  req.session.destroy();
  res.redirect('/signin');
})

app.listen(5000, () => {
  console.log("Server started running");
})