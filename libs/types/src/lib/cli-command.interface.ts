export interface CliCommand {
  getName(): string;
  execute(...parameters: string[]): void;
}
