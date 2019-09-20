/* -- INIT -- */
let lastUpdatedTime

/* -- FETCH CHAT INFORMATION -- */

const fetchChats = function(first) {
  fetch("/getchats",
  {
    "method": "POST",
    "credentials": "include"
  })
  .then(res =>
  {
    console.log(res)
    if (res.status !== 200)
    {
      alert("Authentication failed, please log in!")
      window.location.href="/"
      return
    }
    
    return res.json()
  })
  .then(resJson =>
  {
    console.log(resJson)
    
    lastUpdatedTime = new Date()

    buildChatTable(resJson.chats, resJson.username)

    // Fetch for new chats every second
    if (first === true)
      setTimeout(updateChats, 1000)
  })
}

fetchChats(true)


/* -- UPDATE CHATS EVERY SECOND -- */

const updateChats = function()
{
  //console.log("updating") // commented because it was getting annoying
  
  const currentDate = new Date()
  
  fetch("/updatechats",
  {
    "method": "POST",
    "credentials": "include"
  })
  .then(res =>
  {
    //console.log(res)
    if (res.status !== 200)
    {
      alert("Authentication failed, please log in!")
      window.location.href="/"
      return
    }
    
    return res.json()
  })
  .then(resJson =>
  {
    console.log("lastUpdatedData: ", resJson.lastUpdatedData)

    // See if there are any more chats than there were before:
    if (new Date(resJson.lastUpdatedData).getTime() > lastUpdatedTime.getTime())
      fetchChats(false)
  })
  
  // Continue the loop
  setTimeout(updateChats, 1000)
}


/* -- SEND OVER A NEW CHAT -- */

// define variables that reference elements on our page
const newChatForm = document.forms[0]
const newChatContents = newChatForm.elements["contents"]

// listen for the form to be submitted and add a new dream when it is
newChatForm.onsubmit = function(event)
{
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  fetch("/newchat",
  {
    "method": "POST",
    "credentials": "include",
    "body": JSON.stringify(
    {
      "contents": newChatContents.value,
    }),
    headers: {"Content-Type": "application/json"}
  })
  .then(res => res.json())
  .then(json =>
  {
    console.log(json)
    newChatContents.value = ""
  })
  .catch(err =>
  {
    alert("Failed to send message")
  })
}


/* -- PUT CHATS IN FANCY TABLE -- */

const chatContents = document.getElementById("chat-contents")

const buildChatTable = function(chats, username)
{
  let htmlStr = ""

  for (const n in chats)
  {
    const chat = chats[n]
    
    let lineStr = ""
    lineStr += "<tr>"

    lineStr += "<th class=\"chat-username\">" + chat.username + "</th>"
    lineStr += "<th class=\"chat-contents\">" + chat.contents + "</th>"

    const timeDate = new Date(chat.time)
    const timeStr = timeDate.toLocaleDateString() + "<br/>" + timeDate.toLocaleTimeString()

    lineStr += "<th class=\"chat-timestamp\">" + timeStr + "</th>"
    
    if (chat.username === username)
    {
      lineStr += "<th>"
      lineStr += "<button onclick=\"deleteMessage('" + chat.uuid + "')\">Delete</button>"
      lineStr += "<button onclick=\"editMessage('" + chat.uuid + "')\">Edit</button>"
      lineStr += "</th>"
    }

    lineStr += "</tr>"
    
    // NOTE: this is done backwards so that newer chats appear on the top
    htmlStr = lineStr + htmlStr
  }

  chatContents.innerHTML = htmlStr
}


/* -- FUNCTIONS CALLED ON MESSAGE MODIFICATION BUTTONS -- */

const deleteMessage = function(uuid)
{
  fetch("/deletechat",
  {
    "method": "POST",
    "credentials": "include",
    "body": JSON.stringify(
    {
      "uuid": uuid,
    }),
    headers: {"Content-Type": "application/json"}
  })
  .then(res =>
  {
    //console.log(res)
    if (res.status !== 200)
      alert("Failed to delete message")
  })
}

const editMessage = function(uuid)
{
  const newContents = window.prompt("What are the new contents of the message?")
  if (newContents === null)
    return
  
  fetch("/editchat",
  {
    "method": "POST",
    "credentials": "include",
    "body": JSON.stringify(
    {
      "uuid": uuid,
      "contents": newContents,
    }),
    headers: {"Content-Type": "application/json"}
  })
  .then(res => res.json())
  .then(console.log)
  .catch(err =>
  {
    alert("Failed to edit message")
  })
}