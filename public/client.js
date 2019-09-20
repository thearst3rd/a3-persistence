// client-side js
// run by the browser each time your view template is loaded

// our default array of dreams
const dreams =
[
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const loginForm = document.forms[0];
const usernameInput = loginForm.elements["username"];
const passwordInput = loginForm.elements["password"];

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream)
{
  const newListItem = document.createElement("li");
  newListItem.innerHTML = dream;
  dreamsList.appendChild(newListItem);
}

// iterate through every dream and add it to our page
dreams.forEach( function(dream)
{
  appendNewDream(dream);
});

// listen for the form to be submitted and add a new dream when it is
loginForm.onsubmit = function(event)
{
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  //dreams.push(usernameInput.value);
  //appendNewDream(usernameInput.value);

  // reset form 
  //usernameInput.value = "";
  //usernameInput.focus();
  
  fetch("/login",
  {
    "method": "POST",
    "body": JSON.stringify(
    {
      "username": usernameInput.value,
      "password": passwordInput.value,
    }),
    headers: {"Content-Type": "application/json"}
  })
  .then(res => res.json())
  .then(console.log)
};
