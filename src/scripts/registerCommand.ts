import { REST, Routes } from "discord.js";
import { parseArgs } from "util";
import { commands } from "~/commands";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    guildId: {
      type: 'string',
    },
    commandNames: {
      type: 'string',
      multiple: true,
    },
  },
  strict: true,
  allowPositionals: true,
});

const { guildId, commandNames } = values;

const commandsToRegister = commands.filter(c => commandNames?.includes(c.data.name));
if (!guildId || !commandNames) throw "guildId and commandNames are required\n Usage: bun registerCommands --guildId=<guildId> --commandNames=<commandName1>,<commandName2>";
if (commandsToRegister.length === 0) throw `Commands ${commandNames.toString()} not found\n Available commands: ${commands.map(c => c.data.name).join(', ')}`;

const rest = new REST().setToken(Bun.env.BOT_TOKEN as string);
const data = await rest.put(
  Routes.applicationGuildCommands(Bun.env.CLIENT_ID as string, guildId),
  { body: commandsToRegister.map(c => c.data) }
)
console.log(`Successfully registered command ${commandNames.toString()} in guild ${guildId}`)
console.log(data)