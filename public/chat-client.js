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
    //console.log(res)
    if (res.status === 404)
    {
      alert("Authentication failed, please log in!")
      window.location.href="/"
      return
    }
    
    lastUpdatedTime = new Date()

    // Get all chats from server and put them in the table
    for (const chat in res.chats)
    {
      console.log(chat)
    }

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
  
  fetch("/getchatnum",
  {
    "method": "POST",
    "credentials": "include"
  })
  .then(res =>
  {
    //console.log(res)
    if (res.status === 404)
    {
      alert("Authentication failed, please log in!")
      window.location.href="/"
      return
    }

    // See if there are any more chats than there were before:
    if (new Date(res.lastUpdatedData).getTime() > lastUpdatedTime.getTime())
      fetchChats(false)
  })
  
  // Continue the loop
  setTimeout(updateChats, 1000)
}


/* -- PUT CHATS IN FANCY TABLE -- */

const chatContents = document.getElementById("chat-contents")

const buildChatTable = function(chats)
{
  let htmlStr = ""

  for (const chat in chats)
  {
    htmlStr += "<tr>"

    htmlStr += "<th class=\"chat-username\">" + chat.username + "</th>"
    htmlStr += "<th class=\"chat-contents\">" + chat.contents + "</th>"

    const timeDate = new Date(chat.time)
    const timeStr = timeDate.toLocaleDateString() + "<br/>" + timeDate.toLocaleTimeString()

    htmlStr += "<th class=\"chat-timestamp\">" + timeStr + "</th>"

    htmlStr += "</tr>"
  }

  chatContents.innerHTML = htmlStr
}