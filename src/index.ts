import { Command, Option } from 'commander';
import { fund } from './fund';
import { deploy } from './deploy';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const program = new Command();

program
  .command('fund')
  .description('fund an account on devnet')
  .addOption(
    new Option(
      '--keys [keys...]',
      'keys to create keyset for account (comma separated)',
    ).makeOptionMandatory(true),
  )
  .addOption(
    new Option('--predicate <predicate>', 'predicate to use for keyset')
      .choices(['keys-all', 'keys-one', 'keys-two'])
      .default('keys-all'),
  )
  .action(async (args) => {
    try {
      await fund(args);
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('deploy')
  .description('deploy a module to devnet')
  .option('-m, --sign-manually', 'manually sign transaction', false)
  .addOption(
    new Option(
      '--keys [keys...]',
      'keys to create keyset for account (comma separated)',
    ),
  )
  .addOption(
    new Option(
      '--predicate <predicate>',
      'predicate to use for keyset',
    ).choices(['keys-all', 'keys-one', 'keys-two']),
  )
  .option('--file <file>', 'file to deploy', (filePath) => {
    const path = join(process.cwd(), filePath);
    if (!existsSync(path)) throw Error(`File ${path} does not exist`);
    try {
      return readFileSync(filePath);
    } catch (e) {
      throw Error(`Failed to read file ${path}. Details: ${e}`);
    }
  })
  .action(async (args) => {
    try {
      await deploy(args);
    } catch (error) {
      console.error(error);
    }
  });

// create cli that works like this:

program.parse();
