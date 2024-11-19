javascript
const { spawn } = require('child_process');

const python = spawn('python', ['-m', 'transformers']);

python.stdout.on('data', (data) => {
  console.log(`Received data: ${data.toString()}`);
});

python.stderr.on('data', (error) => {
  console.error(`Received error: ${error.toString()}`);
});

python.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});