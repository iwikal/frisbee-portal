const httpServer = require("http").createServer();

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  // either with send()
  socket.send("Hello from the server!");

  // handle the event sent with socket.send()
  socket.on("message", (data: any) => {
    console.log(data);
  });
});

httpServer.listen(3000);