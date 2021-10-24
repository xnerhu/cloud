import { Command } from "commander";

import { commandFetchDiff } from "./fetch-diff";

export const commandFetch = new Command()
  .name("fetch")
  .addCommand(commandFetchDiff);
