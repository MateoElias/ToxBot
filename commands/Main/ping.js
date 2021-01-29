const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Returns ping",
    run: async(client, message, args) => {

        var ping = new Discord.MessageEmbed()
        .setTitle(`My ping is ${Math.round(client.ws.ping)}ms`)
        .setColor('BLACK')

        message.channel.send(ping)
    }
}