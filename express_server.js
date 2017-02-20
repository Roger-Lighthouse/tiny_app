//var routes=require(./routes);


const express = require("express");
const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session")
const bcrypt = require("bcrypt");
const methodOverride = require('method-override')
const app = express();

var PORT = process.env.PORT || 8080
app.set('view engine', 'ejs');   //app.set('port', (process.env.PORT || 8080));

// attach middleware
app.use(bodyParser.json());  //parse form submission in multiple formats
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(methodOverride('_method'))
app.use((req, res, next) => {  //test middleware set random
  random=42;
  next();
});


//routes(app);
//app.use("/info", routes);

app.listen(PORT, () =>{
  console.log("Ok Server Running!!")
});

//app.listen(app.get('PORT'), () =>{
//  consloe.log("Server Up");
//});
const password1 = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashed_password1 = bcrypt.hashSync(password1, 10);
const password2 = "dishwasher-funk"; // you will probably this from req.params
const hashed_password2 = bcrypt.hashSync(password2, 10);


//var d = new Date();
//document.getElementById("demo").innerHTML = d.toString().substring(4, 21);


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

const users = {
  "user1RandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: hashed_password1,
    urls: ["b2xVn2"]
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: hashed_password2,
    urls: ["9sm5xK"]
  }
}

//console.log('Nut', users);

app.get("/test", (req, res) => {
  res.json = {
    "name": "jane Doe"
  }
  res.send("Just send straight to browser "+JSON.stringify(res.json));
  res.end()
});


app.get("/", (req, res) => {
  // Cookies that have not been signed
  //  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  // console.log('Signed Cookies: ', req.signedCookies)

  //console.log("/urls cookie value", req.session.user_id);
  if(req.session.user_id){
    res.redirect("/urls");
  }else{
    //let templateVars = {message: '', err: 400};
    res.redirect("login");
  }
});

app.get('/register', (req, res) => {
  if(req.session.user_id){
    res.redirect("/");
  }else{
    let templateVars = { message: '', err: 400 };
    res.render('register', templateVars);
  }
});

app.get('/login', (req, res) => {
  //console.log('Get Log Out:', users);
  //console.log("Sesh ID:"+req.session.user_id);
  if(req.session.user_id){
    res.redirect("/");
  }else{
    let templateVars = { message: '', err: 400 };
    res.render('login', templateVars);
  }
});


function checkCurrentUser(req, res){
  let user = null;
  let user_id = null;
  for(key in users){
    if(users[key].email === req.body.email){
      user = users[key];
      user_id = key;
      break;
    }
  }
  if(user){  //console.log("Hash Value:", bcrypt.hashSync(user.password, 10));
    const password = req.body.password;
    if((users[user_id].email === req.body.email) && ((bcrypt.compareSync(password, user.password)))){
      req.session.user_id = user_id;
      let templateVars = {user_id: users[user_id] , urls: urlDatabase };
      res.render("urls_index", templateVars);
    }else if(users[user_id].email === req.body.email && !bcrypt.compareSync(req.body.password,  bcrypt.hashSync(user.password, 10))){
      let templateVars = { message: 'Password is Invalid', err: 400 };
      res.render('login', templateVars);
    }else{
      let templateVars = { message: 'Log In Information is Invalid', err: 400 };
      res.render('login', templateVars);
    }
  }
}


function checkErrors(req, res){
  var noErrors = true;
  if(req.body.email === '' || req.body.password === ''){
    noErrors = false;
  }
  return noErrors;
}


function checkUnique(req, res){
  let email = req.body.email;
  for(var key in users){
    if(users[key].email === email){
      res.status(400).send('<h3>400 Error Code - Email is Invalid.');
    }
  }
}


app.post('/register', (req, res) => {
  checkUnique(req, res);
  checkCurrentUser(req, res);
  if(checkErrors(req, res)){
    let id=generateRandomString();
    users[id] = {id: id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10), urls:[]};
    req.session.user_id = id;
    //console.log('Register:', users);
    //console.log("Sesh ID:"+req.session.user_id);
    res.redirect('/urls');
  }else{
    res.status(400).send('<h3>400 Error Code - Email AND Password Cannot Be Empty.');
 }
});


app.post('/login', (req, res) => {
  checkCurrentUser(req, res);
  res.status(401).send('<h3>401 Error Code - Unauthorized.<br/>You must register first!! <a href="register">Login Page</a>');
});


app.get("/about", (req, res) => {
   res.render("about");
});


app.get("/urls", (req, res) => {
  if(!req.session.user_id){
    res.status(401).send('<h3>401 Error Code - Unauthorized.<br/>You must login first!! <a href="login">Login Page</a>');
  }else{
    res.status(200);
    let templateVars = { user_id: users[req.session.user_id] , urls: urlDatabase };
    res.render("urls_index", templateVars);
  }
});


app.get("/logout", (req, res) => {
  req.session.user_id = null;
  //console.log('Get Log Out:', users);
  //console.log("Sesh ID:"+req.session.user_id);
  res.redirect("login");
});


app.post("/urls", (req, res) => {
  let userId = req.session.user_id;
  if(req.session.user_id){
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURLa;
    let currentUser = users[userId];
    currentUser['urls'].push(shortURL);
    let templateVars = {
      user_id: users[req.session.user_id],
      shortURL: shortURL,
      longURL: req.body.longURLa,
      urls: currentUser.urls,
      urlDatabase: urlDatabase,
    }
    res.render("urls_show", templateVars);
  }else{
    res.status(401).send('<h3>401 Error Code - Unauthorized.<br/>You must login first!! <a href="../login">Login Page</a>');
  }
});


app.delete("/urls/:id", (req, res) => {
  id=req.params.id;
  delete(urlDatabase[id]);
  currUser=users[req.session.user_id]; //req.cookies["user_id"]
  currUser.urls=currUser.urls.filter((item) => {
    if(item !== id);
  });
  let templateVars = {user_id: users[req.session.user_id], urls: urlDatabase};
  res.render("urls_index", templateVars);
});


app.post("/visit/:id", (req, res) => {
  id = req.params.id;
  let longURL = (urlDatabase[id]);
  res.redirect(longURL);
});


app.put("/urls/:id", (req, res) => {
  id=req.params.id;
  urlDatabase[id] = req.body.name;
  let templateVars = {user_id: users[req.session.user_id], urls: urlDatabase};
  res.render("urls_index", templateVars);
});


app.post("/urls/:id/update1", (req, res) => {
  let shortURL = req.params.id;
  let longURLa = urlDatabase[shortURL];
  let currUser = users[req.session.user_id];
  let templateVars = {
    user_id: users[req.session.user_id],
    shortURL: shortURL,
    longURL: longURLa,
    urls: currUser.urls,
    urlDatabase: urlDatabase
  }
  res.render("urls_show", templateVars);
});


app.get("/urls/new", (req, res) => {
  //console.log("/urls/new");
  if(users[req.session.user_id]){
    res.status(200);
    let templateVars = {
      user_id: users[req.session.user_id]
    }
    res.render("urls_new", templateVars);
  }else{
    res.status(401).send('<h3>401 Error Code - Unauthorized.<br/>You must login first!! <a href="../login">Login Page</a>');
  }
});


app.get("/urls/:id", (req, res) => {
  if(!req.session.user_id){
    res.status(401).send('<h3>401 Error Code - Unauthorized.<br/>You must login first!! <a href="../login">Login Page</a>');
  }else{
    let currUser = users[req.session.user_id];
      res.status(200);
      let longURLa = urlDatabase[req.params.id];
      if(longURLa){
        if(currUser.urls.includes(req.params.id)){
         let templateVars = {
          user_id: req.session.user_id,
          shortURL: req.params.id,
          longURL: longURLa,
          urls: currUser.urls,
          urlDatabase: urlDatabase
        };
        res.render("urls_show", templateVars);
        }else{
          res.status(403).send('<h3>403 Error Code - Forbidden');
        }
      }else{
        res.status(404).send('<h3>404 Error Code - Not Found');
      }
    }
});


app.get("/u/:id", (req, res) => {
  let shortid = req.params.id;
  let longURLa = urlDatabase[shortid];
  if(longURLa){
    res.redirect(longURLa);        // Respond with 'Ok' (we will replace this)
  }else{
    res.status(404).send('<h3>404 Error Code - Not Found');
   }
});


function randomPosition(min, max){
  var min = min;
  var max = max;
  var val = Math.floor((Math.random() * (max - min)) + min);
  return val;
}


var p1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var p2 = "1234567890"


function generateRandomString() {
  var ans = "";
  var totString=p1+p1.toLowerCase()+p2;
  for(let x = 0; x < 6; x++){
    let char = totString.charAt(randomPosition(0, 62));
    ans+= char;
  }
  return ans;
}


