const { Server }  = require ('socket.io');

let io = null;

function initWebSocket(server) {
  io = new Server(server); // Creo el servidor io (entrada/salida) del WebSocket
  io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;  // Obtengo el userId de la query de conexión
  console.log('Un usuario se ha conectado');

  if(!userId) {
    socket.disconnect();
    return
  };

  socket.join(userId);

  socket.on('new notification', (notf) => { // Lo que escucha el backend (notf es la notificación que creo en el controller)
    const { toUserId } = notf;  // Destinatario de la notificación
    socket.to(toUserId).emit('new notification', notf); // Lo que escucha el frontend (al destinatario le envía la nueva notificación)
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  })
});

};

module.exports = {
  initWebSocket,
  getIO: () => io,  // Para acceder a io
}