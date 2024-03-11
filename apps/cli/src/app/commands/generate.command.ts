import chalk from 'chalk';

import { CliCommand } from '@2299899-fit-friends/types';
import { PrismaClient } from '@prisma/client';

export class GenerateCommand implements CliCommand {
  private readonly name = '--generate';

  private generateMockData(n: number) {
    console.error(chalk.red(`[generateMockData]: Not implemented`));
  }

  private async seedDb(
    prismaClient: PrismaClient,
    mockRecordsCount: number
  ): Promise<void> {
    console.error(chalk.red(`[seedDb]: Not implemented`));
  }

  public getName(): string {
    return this.name;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [n, connectionString] = parameters;

    try {
      if (!n || n.length == 0) {
        throw new Error('No <n> argument');
      }
      if (!connectionString || connectionString.length == 0) {
        throw new Error('no <connection string> argument');
      }
    } catch (error) {
      console.error(chalk.red("Can't generate data"));
      console.error(chalk.red(`Details: ${error.message}`));
      globalThis.process.exit(1);
    }

    const prismaClient = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });

    try {
      const mockRecordsCount = Number.parseInt(n, 10);
      await this.seedDb(prismaClient, mockRecordsCount);
      globalThis.process.exit(0);
    } catch (error) {
      console.error(chalk.red("Can't generate data"));
      console.error(chalk.red(`Details: ${error.message}`));
      globalThis.process.exit(1);
    } finally {
      await prismaClient.$disconnect();
    }
  }
}
