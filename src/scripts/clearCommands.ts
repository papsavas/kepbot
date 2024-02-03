import { REST, Routes } from "discord.js";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    guildId: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

const { guildId } = values;

if (!guildId) throw "guildId is required\n Usage: bun clearCommands --guildId=<guildId>";

const rest = new REST().setToken(Bun.env.BOT_TOKEN as string);
const data = await rest.put(
  Routes.applicationGuildCommands(Bun.env.CLIENT_ID as string, guildId),
  { body: [] }
)
console.log(data)