const http = require('node-fetch')
const nbx = require('noblox.js')
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: "verify",
    description: "Prototype Command",
    run: async (client, message, args) => {
        //Data From Rover's API
        var data = await http(`https://verify.eryn.io/api/user/${message.author.id}`)
        data = await data.json()
        // Message
        const botMessage = new MessageEmbed

        //Roles
        async function roleManager(groupId, robloxId) {
            const isInGroup = await nbx.getRankInGroup(groupId, robloxId, ) != 0
            if (isInGroup) {
                const rankName = await nbx.getRankNameInGroup(groupId, robloxId)
                const guild = message.guild

                var role = guild.roles.cache.find(r => r.name == rankName);
                message.member.roles.remove(message.member.roles.cache)
                try {
                    await message.member.roles.add(role)
                } catch (err) {
                    message.channel.send("I am unable to find a role to give.")
                }
            } else {
                message.member.roles.remove(message.member.roles.cache)
                message.member.roles.add(r => r.name == 'Class D')
            }
        }


        if (data.status == 'ok') {

            botMessage.setTitle("Verification Successful")
            botMessage.setDescription(`You are currently verified as **${data.robloxUsername}**`)
            botMessage.setColor('GREEN')
            botMessage.addField("***Is this not your account?***", "Re-Verify your account using the following [link](https://verify.eryn.io/)")
            try {
                await message.member.setNickname(data.robloxUsername)
            } catch (err) {
                await message.channel.send("I am unable to change your nickname, please ensure I have the proper permissions")
            } finally {
                message.channel.send(botMessage)
            }

            roleManager(config.robloxGroups.mainGroup, data.robloxId)

        } else {
            switch (data.errorCode) {
                case 404:
                    botMessage.setTitle("User Not Found")
                    botMessage.setColor("RED")
                    botMessage.setDescription("Your account is not verified, you can do so by using the following [link](https://verify.eryn.io/)")
                    break;

                case 429:
                    botMessage.setTitle("Too Many Requests")
                    botMessage.setColor("RED")
                    botMessage.setDescription(`The API is currently receiving too many requests from various clients, please retry after **${data.retryAfterSeconds}** seconds`)
                    break;

                default:
                    botMessage.setTitle(`${data.errorCode} Error`)
                    botMessage.setDescription("An error has occured, please try again after a few minutes, if the error persists, contact server administration.")
                    botMessage.setColor("RED")
            }
            message.channel.send(botMessage)
        }
    }
}