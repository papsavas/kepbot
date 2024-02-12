import { REST, Routes } from "discord.js";
import { parseArgs } from "util";
import { commands } from "~/commands";

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

const commandToRegister = commands.find(c => commandName?.includes(c.data.name));
if (!guildId || !commandName) throw "guildId and commandName are required\n Usage: bun registerCommands --guildId=<guildId> --commandName=<commandName>";
if (!commandToRegister) throw `Command ${commandName.toString()} not found\n Available commands: ${commands.map(c => c.data.name).join(', ')}`;

const rest = new REST().setToken(Bun.env.BOT_TOKEN as string);
const data = await rest.post(
  Routes.applicationGuildCommands(Bun.env.CLIENT_ID as string, guildId),
  { body: commandToRegister.data }
)
console.log(`Successfully registered command ${commandName.toString()} in guild ${guildId}`)
console.log(data)