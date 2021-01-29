const {Collection, Client, Discord} = require('discord.js');
const fs = require('fs');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'] } });
const config = require('./config.json')
const noblox = require('noblox.js');
var prefix = "$"
client.commands = new Collection();
client.aliases = new Collection();
client.config = config;
client.categories = fs.readdirSync('./commands/');
['command'].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on('ready', async () => {  
    console.log('Bot online')
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLocaleLowerCase();
    if (cmd.length == 0) return;
    const command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args)
})

client.login(config.TOKEN)