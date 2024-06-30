const net = require('node:net');
const clients = {};
let userCount = 0;

const server = net.createServer((client) => {
    console.log('Client connected');
    const userID = Date.now().toString();
    const clientName = `user-${++userCount}`;
    
    clients[userID] = {
        name: clientName,
        client
    };
    
    broadcast(`${clientName} joined`, client);

    client.on('data', (data) => {
        console.log('Received data:', data.toString('utf-8'));
        broadcast(`${clients[userID].name}: ${data.toString('utf-8')}`, client);
    });

    client.on('end', () => {
        console.log(`${clientName} disconnected`);
        delete clients[userID];
        broadcast(`${clientName} left`);
    });

    client.on('error', (err) => {
        console.error('Client error:', err.message);
    });
});

server.listen(3001, 'localhost', () => {
    console.log('Server listening on port 3001');
});

function broadcast(message, sender) {
    for (const [id, clientObj] of Object.entries(clients)) {
        if (clientObj.client !== sender) {
            clientObj.client.write(message);
        }
    }
}
