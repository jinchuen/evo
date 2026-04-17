#!/usr/bin/env node
const { Command } = require('commander');
const { downloadTemplate } = require('giget');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

// 1. COMMAND: evo new <name>
program
  .command('new <name>')
  .description('Create a new Evo project')
  .action(async (name) => {
    console.log(chalk.blue(`🚀 Cloning Evo Starter into ${name}...`));
    await downloadTemplate(`github:your-username/evo-starter`, { dir: name });
    console.log(chalk.green('✅ Done! Now run npm install.'));
  });

// 2. COMMAND: evo g p <name>
program
  .command('g <type> <name>')
  .action(async (type, name) => {
    if (type === 'p') {
      // 1. Find the template INSIDE the CLI folder
      // We go up one level from 'bin' to find 'src/templates'
      const templatePath = path.join(__dirname, '../src/templates/page.txt');

      if (!fs.existsSync(templatePath)) {
          console.error("Internal Error: Template missing in CLI package.");
          return;
      }

      // 2. Read the internal template
      let content = fs.readFileSync(templatePath, 'utf8');
      content = content.replace(/{{NAME}}/g, name);

      // 3. Write it to the USER'S current project (process.cwd)
      const targetPath = path.join(process.cwd(), `src/app/${name.toLowerCase()}/page.tsx`);
      
      await fs.outputFile(targetPath, content);
      console.log(`Successfully generated ${targetPath}`);
    }
  });

program.parse(process.argv);