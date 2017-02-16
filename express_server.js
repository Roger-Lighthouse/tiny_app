//var routes=require(./routes);


const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

var PORT = process.env.PORT || 8080



app.set('view engine', 'ejs');

//app.set('port', (process.env.PORT || 8080));

// attach middleware
app.use(bodyParser.json());  //parse form submission in multiple formats
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.use((req, res, next) => {
  random=42;

  next();
});


//routes(app);
//app.use("/info", routes);

app.listen(PORT, () =>{
  console.log("Ok Server Running!!")
});

//app.listen(app.get('port'), () =>{
//  consloe.log("Server Up");
//});


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

const users = {
  "user1RandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }


}

app.get("/test", (req, res) => {
  res.json = {
    "name": "jane Doe"
  }
  //js = JSON.parse(res.json);
  res.send("Just send straight to browser "+JSON.stringify(res.json));
 });


app.get("/", (req, res) => {
 // Cookies that have not been signed
//  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
 // console.log('Signed Cookies: ', req.signedCookies)

  console.log("KOOKEE:", req.cookies);
  console.log("USRES", users);
/*
  if(users[req.cookies["user_id"]]){
    let templateVars = {user_id: users[req.cookies["user_id"]], message: '', err: 400};
    res.render("login", templateVars);
  }else{
    res.redirect("register");
  }
*/
  let templateVars = {message: '', err: 400};
  res.render("login", templateVars);
});

app.get('/register', (req, res) => {
    let templateVars = { message: '', err: 400 };
    res.render('register', templateVars);
});

app.get('/login', (req, res) => {
    let templateVars = { message: '', err: 400 };
    res.render('login', templateVars);
});



function checkCurrentUser(req, res){
  user_id=req.cookies["user_id"];
  if(users[user_id]){
    if(users[user_id].email === req.body.email && users[user_id].password === req.body.password){
        let templateVars = {user_id: users[user_id] , urls: urlDatabase };
        res.render("urls_index", templateVars);
    }else if(users[user_id].email === req.body.email && users[user_id].password !== req.body.password){
      let templateVars = { message: 'Password is Invalid', err: 400 };
      res.render('login', templateVars);

    }else{
      let templateVars = { message: 'Log Information is Invalid', err: 400 };
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

app.post('/register', (req, res) => {
  checkCurrentUser(req, res);
  if(checkErrors(req, res)){
    let id=generateRandomString();
    users[id] = {id: id, email: req.body.email, password: req.body.password};
    res.cookie('user_id', id);
    console.log(users);
    res.redirect('/urls');
  }else{
    let templateVars = { message: 'Invalid Registration Data', err: 400 };
    res.render('register', templateVars);
  }
});

app.post('/login', (req, res) => {
  checkCurrentUser(req, res);
  let templateVars = { message: 'Please Register First', err: 0 };
  res.render('register', templateVars);
});

app.get("/about", (req, res) => {
   res.render("about");
});

app.get("/urls", (req, res) => {
  console.log('User ID:'+req.cookies["user_id"])
  let templateVars = { user_id: users[req.cookies["user_id"]] , urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/logout", (req, res) => {
  res.redirect("login");
});

app.post("/urls", (req, res) => {
  var ans=req.body;
  shortURL=generateRandomString();
  urlDatabase[shortURL]=ans["longURLa"];
    // debug statement to see POST parameters
    //console.log(urlDatabase);
    let templateVars = {
     user_id: users[req.cookies["user_id"]],
     shortURL: shortURL,
     longURL: ans["longURLa"],
     urls: urlDatabase
   }
   res.render("urls_show", templateVars);
 });

app.post("/urls/:id/delete", (req, res) => {
  id=req.params.id;
  delete(urlDatabase[id]);
  let templateVars = {user_id: users[req.cookies["user_id"]], urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/update", (req, res) => {
  //console.log("GOT HERE!!");
  id=req.params.id;
  urlDatabase[id]=req.body.name;
  //console.log('ok?', urlDatabase);
  let templateVars = {user_id: users[req.cookies["user_id"]], urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/update1", (req, res) => {
  let shortURL=req.params.id;
  let longURLa=urlDatabase[shortURL];
  //console.log(urlDatabase);
  let templateVars = {
    user_id: users[req.cookies["user_id"]],
    shortURL: shortURL,
    longURL: longURLa,
    urls: urlDatabase
  }
  res.render("urls_show", templateVars);
});

//  res.redirect(`http://localhost:8080/urls/${shortURL}`);        // Respond with 'Ok' (we will replace this)
//});

app.get("/urls/new", (req, res) => {
  //console.log("/urls/new");
  let templateVars = {
    user_id: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let longURLa=urlDatabase[req.params.id];
  let templateVars = {
    user_id: req.cookies["user_id"],
    shortURL: req.params.id,
    longURL: longURLa,
    urls: urlDatabase
  };
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  //console.log(`/urls/${shortURL}`);
  let shortid = req.params.id;
  let longURLa = urlDatabase[shortid];

  //console.log('Long URL '+longURLa);
  if(longURLa){
    res.redirect(longURLa);        // Respond with 'Ok' (we will replace this)
  }else{
    let templateVars = {
      user_id: users[req.cookies["user_id"]],
      shortid: shortid,
      err: 400
    };
    res.render("bad_url", templateVars);        // Respond with 'Ok' (we will replace this)
  }
});




function randomPosition(min, max){
  var min=min;
  var max=max;
  var val=Math.floor((Math.random()*(max-min))+min);
  return val;
}


var p1="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var p2="1234567890"
function generateRandomString() {
  var ans="";
  var totString=p1+p1.toLowerCase()+p2;
  for(let x=0; x<6; x++){
    let char=totString.charAt(randomPosition(0, 62));
    ans+=char;
  }
  return ans;
}

