PermChat
---

http://a3-thearst3rd.glitch.me

The goal of PermChat is to do what my last application, "Big Chat", could not: store the chat messages permenantly!

One of the things that held me up for a while was that I misread some of the lecture notes. Instead of using `passport.use`, I used `app.use` for one of my setup functions and it threw errors for hours. Maybe those function names shouldn't be the same...

Another big challenge was figuring out a nice way to have the server let people know that data has been changed, such as new messages. I ended up using a second POST method that just returns the last time message contents were changed, and if it's after what the webpage thinks is the last time, it will request the full table again.

Lastly, figuring out a nice way to allow users to edit their own messages was quite challenging. I ended up settling for popup boxes, even though they don't look quite as pretty, but it was easier to implement

I used local authentication with cookies because it was the easiest. Similarly with the CSS framework, milligram, because it looked nice and clean and got an endorsement from the professor.

The five express middlewares I am using are:

- **body-parser**: for parsing incoming JSON data
- **passport**: for authentication by username and password
- **express-session**: for continuous authentication using cookies over the course of a single session
- **serve-favicon**: for sending over the favicon.ico early in the `app.use` chain for extra performance
- **timeout**: to ensure all incoming messages are handled properly if they time out

## Technical Achievements

- **Refresh new chats**: The client will check with the server for new chat messages as they arrive for a smoother chat experience! No need to constantly refresh the page.
- **Use of UUIDs to generate buttons** - Used a npm package to randomly assign every message a UUID to determine which message to edit or delete

### Design/Evaluation Achievements

- **Best Practices**: I followed best practices for accessibility, including providing alt attributes for images and using semantic HTML. There are no `<div>` or `<span>` elements in my document. Yes I did copy and paste this from the original README but it is true!
- **Number of users**: We tested the application with four concurrent users, finding that we could all chat together with no hiccups whatsoever!