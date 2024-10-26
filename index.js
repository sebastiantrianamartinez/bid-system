// server.js
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const NodeCache = require("node-cache");
const cors = require("cors");
const path = require("path");

const app = express();
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

app.use(express.json());
app.use(cors());

app.get("/cache/:key", (req, res) => {
	const key = req.params.key;
	const value = myCache.get(key);
	if (value) {
		res.json({ key, value });
	} else {
		res.status(404).json({ error: "Key not found" });
	}
});

// Ruta POST para escribir datos en la caché
app.post("/cache", (req, res) => {
	const { key, value } = req.body;
	myCache.set(key, value);
	broadcastCacheChange(key, value);
	res.json({ key, value });
});


app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta catch-all para manejar subrutas con React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta GET para leer datos de la caché


// Crear servidor HTTP
const server = http.createServer(app);

// Crear servidor WebSocket
const wss = new WebSocket.Server({ server });

// Manejar eventos de conexión
wss.on("connection", (ws) => {
	console.log("Cliente conectado");
});

// Función para enviar un evento WebSocket cuando se cambia un dato en la caché
function broadcastCacheChange(key, value) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ event: "cacheChange", key, value }));
		}
	});
}

// Iniciar servidor HTTP en el puerto 8080
server.listen(4848, () => {
	console.log("Servidor HTTP y WebSocket escuchando en el puerto 4848");
});
