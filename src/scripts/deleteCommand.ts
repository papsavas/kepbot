import { REST, Routes, type APIApplicationCommand } from "discord.js";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    guildId: {
      type: 'string',
    },
    commandName: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

const { guildId, commandName } = values;

// const commandToRegister = commands.find(c => commandName?.includes(c.data.name));
if (!guildId || !commandName) throw "guildId and commandName are required\n Usage: bun registerCommands --guildId=<guildId> --commandName=<commandName1>,<commandName2>";

const rest = new REST().setToken(Bun.env.BOT_TOKEN as string);
const commands = await rest.get(Routes.applicationGuildCommands(Bun.env.CLIENT_ID as string, guildId)) as APIApplicationCommand[];
const commandToDelete = commands.find(c => c.name === commandName);
if (!commandToDelete) throw `Command ${commandName.toString()} not found\n Available commands: ${commands.map(c => c.name).join(', ')}`;

const data = await rest.delete(Routes.applicationGuildCommand(Bun.env.CLIENT_ID as string, guildId, commandToDelete.id));
console.log(`Successfully registered command ${commandName.toString()} in guild ${guildId}`)
console.log(data)