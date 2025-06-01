import { exec } from 'child_process';

const seedAll = () => {
  exec('npm run seed:all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(stdout);
  });
};

seedAll();
