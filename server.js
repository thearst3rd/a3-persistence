// server.js
// where your node app starts

// init project
const express    = require("express"),
      app        = express(),
      session    = require("express-session"),
      passport   = require("passport"),
      Local      = require("passport-local").Strategy,
      bodyParser = require("body-parser")

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response)
{
  response.sendFile(__dirname + '/views/index.html')
})

const users = 
[
  {"username": "thearst3rd", "password": "bruh1234"},
  {"username": "terry", "password": "passworddd"},
]

// Setup passport authentication
const myLocalStrategy = function(username, password, done)
{
  const user = users.find(usr => usr.username === username)
  
  if ((user !== undefined) && (user.password === password))
  {
    return done(null, {username, password})
  }
  else
  {
    return done(null, false, {"message": "Authentication Failed"})
  }
}

passport.use(new Local(myLocalStrategy))

app.use(session({"secret": "top 5 bruh moments", "resave": false, "saveUninitialized": false}))
app.use(passport.initialize())
app.use(passport.session())

// Listen for logging in
app.post(
  "/login",
  passport.authenticate("local"),
  function(req, res)
  {
    console.log("user:", req.user)
    res.json({"status": true})
  }
)

// Listen for authentication with cookie
app.post(
  "/test",
  function(req, res)
  {
    console.log("Authenticate with cookie?", req.user)
    res.json({"status": "success"})
  }
)

passport.serializeUser((user, done) => done(null, user.username))
passport.deserializeUser((username, done) =>
{
  console.log("deserializing: ", username)
  const user = users.find(u => u.username === username)
  
  if (user === undefined)
  {
    done(null, false, {"message": "User not found, session not restored"})
    return
  }
  
  done(null, user)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function()
{
  console.log("Your app is listening on port " + listener.address().port)
})
