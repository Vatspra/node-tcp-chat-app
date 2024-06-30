const net = require('node:net');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output, prompt: 'Enter your message ->' });

const client = net.createConnection({ host: 'localhost', port: '3001' }, () => {
    console.log('Connected to server');
    rl.prompt();
});

rl.on('line', (line) => {
    const message = line.trim();
    if (message.toLowerCase() === 'exit') {
        client.end();
    } else {
        client.write(message);
        rl.prompt();
    }
});

client.on('data', (data) => {
    console.log('\n' + data.toString('utf-8'));
    rl.prompt();
});

client.on('end', () => {
    console.log('Disconnected from server');
    rl.close();
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});
