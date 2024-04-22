const http = require('http').createServer();
const io = require('socket.io')(http);
const port = 3000;
http.listen(port,()=>{
    console.log(`Server is connected on the ${port}`)
});

io.on('connection',(socket)=>{
    console.log('connected');
    socket.on('message',(evt)=>{
         loadEnvFile(evt);
         socket.broadcast.emit('message',evt);
    });
});

socket.disconnect('message',()=>{
    console.log('disconnected');
});