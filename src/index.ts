import { Command, Option } from 'commander';
import { fund } from './fund';
const program = new Command();

program
  .command('fund')
  .description('fund an account on devnet')
  .addOption(
    new Option(
      '--keys [keys...]',
      'keys to create keyset for account (comma separated)'
    ).makeOptionMandatory(true)
  )
  .addOption(
    new Option('--predicate <predicate>', 'predicate to use for keyset')
      .choices(['keys-all', 'keys-one', 'keys-two'])
      .default('keys-all')
  )
  .action(async (args) => {
    try {
      await fund(args);
    } catch (error) {
      console.error(error);
    }
  });

// create cli that works like this:

program.parse();
