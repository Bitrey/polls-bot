# Discord Polls bot

This is a free and open source polls bot for Discord servers, written in TypeScript with Discord.js.

If you want to host your own version, here's how you can do it:
- Clone the repository somewhere on your machine
- Install the dependencies with `npm install`
- Configure the environment variables (more info below)
- Compile the project using `npm run build`
- You'll find the compiled version inside the `build` folder

### Configuring environment variables
To run this bot, you need to configure 2 environment variables:
```
BOT_TOKEN=Your Discord bot token
MONGODB_URI=Your MongoDB URI
```
If you want to use a file, create a `.env` file and place it inside the root folder.
