PermChat
---

http://a3-thearst3rd.glitch.me

The goal of PermChat is to do what my last application, "Big Chat", could not: store the chat messages permenantly!

One of the things that held me up for a while was that I misread some of the lecture notes. Instead of using `passport.use`, I used `app.use` for one of my setup functions and it threw errors for hours. Maybe those function names shouldn't be the same...

Another big challenge was figuring out a nice way to have the server let people know that data has been changed, such as new messages. I ended up using a second POST method that just returns the number of messages, rather than the server needing to send over all of the data every time.

I used local authentication with cookies because it was the easiest. Similarly with the CSS framework, milligram, because it looked nice and clean and got an endorsement from the professor.

The five express middlewares I am using are:

- **body-parser**: for parsing incoming JSON data
- **passport**: for authentication

## Technical Achievements

- **Refresh new chats**: The client will check with the server for new chat messages as they arrive for a smoother chat experience! No need to constantly refresh the page.

### Design/Evaluation Achievements

- **Best Practices**: I followed best practices for accessibility, including providing alt attributes for images and using semantic HTML. There are no `<div>` or `<span>` elements in my document. Yes I did copy and paste this from the original README but it is true!
- **Number of users**: We tested the application with n=4 users, finding that we could all chat together with no hiccups whatsoever!
