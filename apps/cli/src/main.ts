#!/usr/bin/env node
import 'reflect-metadata';

import { CliApplication, GenerateCommand, HelpCommand } from './app';

const bootstrap = () => {
  const cliApplication = new CliApplication();
  cliApplication.registerCommands([new HelpCommand(), new GenerateCommand()]);
  cliApplication.processCommand(process.argv);
};

bootstrap();
