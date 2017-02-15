var express = require("express");
var app = express();

var PORT = process.env.PORT || 8080

app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
   res.render("about");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  var ans=req.body;
  shortURL=generateRandomString();
  urlDatabase[shortURL]=ans["longURL"];
    // debug statement to see POST parameters
    console.log(urlDatabase);
  res.redirect(`http://localhost:8080/urls/${shortURL}`);        // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  console.log("/urls/new");
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  console.log(`/urls/${shortURL}`);
  let longURLa=urlDatabase[req.params.id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURLa
  };
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  console.log(`/urls/${shortURL}`);
  let longURLa=urlDatabase[req.params.id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURLa
  };
  res.redirect(longURLa);        // Respond with 'Ok' (we will replace this)

});












app.listen(PORT, () =>{
  console.log("Ok Server Running!!")
});

function randomPosition(){
  var min=0;
  var max=62;
  var val=Math.floor((Math.random()*(max-min))+min);
  return val;
}


var p1="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var p2="1234567890"
function generateRandomString() {
  var ans="";
  var totString=p1+p1.toLowerCase()+p2;
  for(let x=0; x<6; x++){
    let char=totString.charAt(randomPosition());
    ans+=char;
  }
  return ans;
}

generateRandomString();
generateRandomString();
generateRandomString();
generateRandomString();
generateRandomString();