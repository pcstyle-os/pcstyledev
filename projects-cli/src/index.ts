#!/usr/bin/env bun
import { Command } from 'commander'
import { add } from './commands/add'
import { ls } from './commands/ls'
import { view } from './commands/view'
import { update } from './commands/update'
import { changestatus } from './commands/changestatus'
import { deleteProject } from './commands/delete'

const program = new Command()

program
  .name('projects')
  .description('manage pcstyle.dev projects')
  .version('1.0.0')

program
  .command('add <dirname>')
  .description('analyze project directory with gemini and add to site')
  .action(add)

program
  .command('ls')
  .description('list all projects')
  .option('-s, --status <status>', 'filter by status (active, maintenance, experimental, prototype, disabled)')
  .action(ls)

program
  .command('view [name]')
  .description('view project details')
  .action(view)

program
  .command('update <name>')
  .description('update project fields')
  .option('-f, --field <field>', 'specific field to update')
  .action(update)

program
  .command('changestatus <name>')
  .alias('status')
  .description('change project status')
  .action(changestatus)

program
  .command('delete <name>')
  .alias('rm')
  .description('delete a project')
  .option('-y, --yes', 'skip confirmation')
  .action(deleteProject)

program.parse()
