/*
 * CS 4241 Assignment 3
 * by Terry Hearst
 */


/* -- INIT -- */

const express    = require("express"),
      app        = express(),
      session    = require("express-session"),
      passport   = require("passport"),
      Local      = require("passport-local").Strategy,
      bodyParser = require("body-parser"),
      low        = require("lowdb"),
      FileSync   = require("lowdb/adapters/FileSync"),
      favicon    = require("serve-favicon"),
      path       = require("path")


app.use(express.static('public'))

/* -- MIDDLEWARE #3 (put very early for performance) - serve-favicon -- */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


/* -- MIDDLEWARE #1 - body-parser -- */

app.use(bodyParser.json())

app.get('/', function(request, response)
{
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/chat', function(request, response)
{
  response.sendFile(__dirname + '/views/chat.html')
})


/* -- SETUP lowdb -- */

const adapter = new FileSync("db.json")
const db = low(adapter)

db.defaults(
{
  "users":
  [
    {"username": "thearst3rd", "password": "bruh1234"},
    {"username": "terry", "password": "awful_password"},
  ],
  "chats": [],
  "lastmodified": new Date()
}).write()


/* -- MIDDLEWARE #2 - passport -- */

// Function that finds a user with a given username
const findUser = function(username)
{
  return db.get("users")
    .find({"username": username})
    .value()
}

// Setup passport authentication
passport.use(new Local(function(username, password, done)
{
  const user = findUser(username)
  
  if ((user !== undefined) && (user.password === password))
  {
    return done(null, {username, password})
  }
  else
  {
    return done(null, false, {"message": "Authentication Failed"})
  }
}))

app.use(session({"secret": "top 5 bruh moments", "resave": false, "saveUninitialized": false}))
app.use(passport.initialize())
app.use(passport.session())


/* -- LISTEN FOR LOGIN REQUESTS -- */

app.post(
  "/login",
  passport.authenticate("local"),
  function(req, res)
  {
    console.log(res)
    console.log("user:", req.user)
    res.redirect("/chat")
  }
)


/* -- LISTEN FOR SIGN UP REQUESTS -- */

app.post(
  "/signup",
  function(req, res)
  {
    console.log(res)
    console.log("new user:", req.user)
    res.redirect("/chat")
  }
)


/* -- LISTEN FOR CHAT DATA REQUESTS -- */

// All chat data
app.post(
  "/getchats",
  function(req, res)
  {
    console.log("Authenticate with cookie?", req.user)
    res.json({"status": true, "chats": db.get("chats")})
  }
)
passport.serializeUser((user, done) => done(null, user.username))
passport.deserializeUser((username, done) =>
{
  console.log("deserializing: ", username)
  const user = findUser(username)
  
  if (user === undefined)
  {
    done(null, false, {"message": "User not found, session not restored"})
    return
  }
  
  done(null, user)
})

// Update chat data
app.post(
  "/updatechats",
  function(req, res)
  {
    //console.log("Authenticate with cookie?", req.user) // commented because it cluttered up the chat
    res.json({"status": true, "chats": db.get("chats")})
  }
)
passport.serializeUser((user, done) => done(null, user.username))
passport.deserializeUser((username, done) =>
{
  console.log("deserializing: ", username)
  const user = findUser(username)
  
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
