import chalk from 'chalk';

import { CliCommand } from '@2299899-fit-friends/types';

export class HelpCommand implements CliCommand {
  private readonly name = '--help';

  public getName(): string {
    return this.name;
  }

  public async execute(): Promise<void> {
    console.info(
      chalk.blue(`
      CLI application for generating mock data and filling database
      Example:
          ${chalk.green('npm run cli --<command> [--arguments]')}
      Commands:
          ${chalk.green(
            '--help'
          )}:                              # Prints help text with available commands
          ${chalk.green(
            '--generate <n> <connection string>'
          )}:  # Generates <n> number of mock data and fill database via <connection string>
    `)
    );
  }
}
