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
      path       = require("path"),
      uuid       = require("uuid/v4"),
      timeout    = require("connect-timeout")


/* -- MIDDLEWARE #5 - timeout -- */

app.use(timeout('5s'))

const haltOnTimedout = function(req, res, next) {
  if (!req.timedout) next()
}


/* -- MIDDLEWARE #4 - serve-favicon -- */

app.use(favicon(path.join(__dirname, "public", "favicon.ico")))

app.use(express.static("public"))


/* -- MIDDLEWARE #1 - body-parser -- */

app.use(bodyParser.json())
app.use(haltOnTimedout)

app.get("/", function(request, response)
{
  response.sendFile(__dirname + "/views/index.html")
})
app.get("/chat", function(request, response)
{
  response.sendFile(__dirname + "/views/chat.html")
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
    {"username": "ChatBot", "password": "lol"},
  ],
  "chats":
  [
    {"username": "ChatBot", "contents": "Welcome to the chatroom!" , "time": new Date(), "uuid": uuid()},
    {"username": "ChatBot", "contents": "Please enjoy your stay!" , "time": new Date(), "uuid": uuid()},
  ],
  "lastUpdatedData": new Date()
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

/* -- MIDDLEWARE #3 - session -- */

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
    console.log("new user:", req.body.username)
    
    // Make sure user does not already exist
    if (findUser(req.body.username) !== undefined)
    {
      res.status(403) // Forbidden
      res.send()
      return
    }
    
    db.get("users")
      .push({"username": req.body.username, "password": req.body.password})
      .write()
    
    res.json({"status": "success"})
  }
)


/* -- LISTEN FOR CHAT DATA REQUESTS -- */

// All chat data
app.post(
  "/getchats",
  function(req, res)
  {
    if (req.user === undefined)
    {
      res.status(401) // Unauthorized
      res.send()
      return
    }
    
    console.log("Authenticated " + req.user.username + " with cookie")
    res.json({"status": true, "username": req.user.username, "chats": db.get("chats")})
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
    if (req.user === undefined)
    {
      res.status(401) // Unauthorized
      res.send()
      return
    }
    
    //console.log("Authenticated " + req.user.username + " with cookie") // commented because it cluttered up the chat
    res.json({"status": true, "lastUpdatedData": db.get("lastUpdatedData")})
  }
)


/* -- LISTEN FOR INCOMING CHATS -- */

app.post(
  "/newchat",
  function(req, res)
  {
    if (req.user === undefined)
    {
      res.status(401) // Unauthorized
      res.send()
      return
    }
    
    //console.log(req)
    console.log("chat from user:", req.user.username)
    
    db.get("chats")
      .push({"username": req.user.username, "contents": req.body.contents, "time": new Date(), "uuid": uuid()})
      .write()
    
    db.set("lastUpdatedData", new Date().toString())
      .write()
    
    res.json({"status": "success"})
  }
)


/* -- LISTEN FOR MESSAGE MODIFICATIONS -- */

app.post(
  "/editchat",
  function(req, res)
  {
    console.log(req.body)
    console.log(db.get("chats").find({"uuid": req.body.uuid}).value())
    if ((req.user === undefined) || (req.user.username !== db.get("chats").find({"uuid": req.body.uuid}).value().username))
    {
      res.status(401) // Unauthorized
      res.send()
      return
    }
    
    db.get("chats")
      .find({"uuid": req.body.uuid})
      .assign({"contents": req.body.contents, "time": new Date()})
      .write()
    
    db.set("lastUpdatedData", new Date().toString())
      .write()
    
    res.json({"status": "success"})
  }
)

app.post(
  "/deletechat",
  function(req, res)
  {
    console.log(req.body)
    console.log(db.get("chats").find({"uuid": req.body.uuid}).value())
    if ((req.user === undefined) || (req.user.username !== db.get("chats").find({"uuid": req.body.uuid}).value().username))
    {
      res.status(401) // Unauthorized
      res.send()
      return
    }
    
    db.get("chats")
      .remove({"uuid": req.body.uuid})
      .write()
    
    db.set("lastUpdatedData", new Date().toString())
      .write()
    
    res.json({"status": "success"})
  }
)


/* -- SETUP SERVER TO LISTEN TO INCOMING REQUESTS -- */

const listener = app.listen(process.env.PORT, function()
{
  console.log("Your app is listening on port " + listener.address().port)
})