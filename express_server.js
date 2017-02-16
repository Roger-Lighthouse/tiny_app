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


  let templateVars = {  username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
  //res.redirect("/")
});

app.get("/about", (req, res) => {
   res.render("about");
});

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});



app.post("/urls", (req, res) => {
  var ans=req.body;
  shortURL=generateRandomString();
  urlDatabase[shortURL]=ans["longURLa"];
    // debug statement to see POST parameters
    console.log(urlDatabase);
    let templateVars = {
     username: req.cookies["username"],
     shortURL: shortURL,
     longURL: ans["longURLa"],
     urls: urlDatabase
   }
   res.render("urls_show", templateVars);
 });

app.post("/urls/:id/delete", (req, res) => {
  id=req.params.id;
  delete(urlDatabase[id]);
  let templateVars = {username: req.cookies["username"], urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/update", (req, res) => {
  console.log("GOT HERE!!");
  id=req.params.id;
  urlDatabase[id]=req.body.name;
  console.log('ok?', urlDatabase);
  let templateVars = {username: req.cookies["username"], urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/update1", (req, res) => {
  let shortURL=req.params.id;
  let longURLa=urlDatabase[shortURL];
  console.log(urlDatabase);
  let templateVars = {
    username: req.cookies["username"],
    shortURL: shortURL,
    longURL: longURLa,
    urls: urlDatabase
  }
  res.render("urls_show", templateVars);
});

//  res.redirect(`http://localhost:8080/urls/${shortURL}`);        // Respond with 'Ok' (we will replace this)
//});

app.get("/urls/new", (req, res) => {
  console.log("/urls/new");
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let longURLa=urlDatabase[req.params.id];
  let templateVars = {
    username: req.cookies["username"],
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

  console.log('Long URL '+longURLa);
  if(longURLa){
    res.redirect(longURLa);        // Respond with 'Ok' (we will replace this)
  }else{
    let templateVars = {
      username: req.cookies["username"],
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

generateRandomString();
generateRandomString();
generateRandomString();
generateRandomString();
generateRandomString();