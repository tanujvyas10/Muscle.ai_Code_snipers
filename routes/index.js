var express = require('express');
var router = express.Router();
const passport=require('../stratergies')

const session=require('express-session')
const { connectdb }=require('../database/db')

router.use(session({
  secret: 'kamehameha',
  resave: false,
  saveUninitialized: true,
}))

router.use(passport.initialize())
router.use(passport.session())

function checkLogin(req, res, next) {
  if(req.user) {
      return next()
  }
  else {
      res.send('<h1>Error 403</h1><h3>Login First!!<h3>')
  }
}

router.get('/signout', (req, res) => {
  req.logout()
  res.redirect('/')
})

/* GET home page. */
router.get('/exercise1', checkLogin, function(req, res, next) {
  res.render('index');
});

router.get("/breathing", checkLogin, (req,res,next)=>{
  res.render("breathing")
})

router.get("/menu", checkLogin, (req, res, next)=>{
  res.render('menu')
})

router.get("/exercise2", checkLogin, (req,res,next)=>{
  res.render("sideRaises")
})

router.get("/",(req,res,next)=>{
  res.render("home")
})

router.post('/signup', (req, res) => {
  let nuser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      calories: 0
  }
  connectdb('hackTIET')
      .then(db => db.collection('users').insertOne(nuser))
      .then(() => res.redirect('/'))
      .catch(err => {
          console.log(err)
          res.send(err)
      })
})

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/menu',
  failureRedirect: '/'
}))


router.get("/progress", checkLogin, (req,res,next)=>{
  connectdb('hackTIET')
  .then(db => db.collection('users').findOne({ username : req.user[0].username}))
  .then((data) => {
    console.log("--",data)
    res.render("progress",{data:data})
  }
    )
  .catch(err => {
      console.log(err)
      res.send(err)
  })
  
})
router.post("/performance", checkLogin, (req,res,next)=>{
  
  var calories=0;
  var performance=req.body.performance
  var newArr=[]
  performance=performance.split(',')
  
  performance.forEach((el)=>{
newArr.push(parseFloat(el))
  })
  
  var max = newArr.reduce(function(a, b) { return Math.max(a, b); });

  var percentage = []
  newArr.forEach((el)=>{
    percentage.push((el / max)*100)
    calories+=calories+2*(el / max)
  })
  
  percentage[4]=percentage[4]+Math.abs(Math.random()*100)

  console.log(typeof calories)
  let tcal=calories.toFixed(2)
  console.log("caloires",tcal)
  console.log("parcej--->",percentage)

  let acc=0
  percentage.forEach((el)=>{
    acc+=el
  })

  acc=acc / percentage.length
  console.log('gffffffffffffffffffffffffffffffffffffffff')
  console.log(req.user[0].calories)
  let cc=parseFloat(req.user[0].calories) + parseFloat(tcal);
  connectdb('hackTIET')
      .then(db => db.collection('users').updateOne(
        { username : req.user[0].username}, 
        { $set: {accuracy: acc, calories: cc}}))
      .then(() => res.redirect('/'))
      .catch(err => {
          console.log(err)
          res.send(err)
      })

  res.render("graph_acc",{data:percentage,calories:tcal})
})
module.exports = router;
