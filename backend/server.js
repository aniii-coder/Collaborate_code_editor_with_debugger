
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const os = require("os");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

app.get("/server-ip", (req, res) => {
  res.json({ ip: getLocalIP() });
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let currentCode = "// Start coding...";
let currentLanguage = "python"; // Default language

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
  socket.emit("codeUpdate", currentCode);
  socket.emit("languageUpdate", currentLanguage);

  socket.on("codeChange", (code) => {
    currentCode = code;
    socket.broadcast.emit("codeUpdate", code);
  });

  socket.on("languageChange", (language) => {
    currentLanguage = language;
    socket.broadcast.emit("languageUpdate", language);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://${getLocalIP()}:${PORT}`);
});





































