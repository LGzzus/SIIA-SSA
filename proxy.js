const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuración del proxy
app.use( createProxyMiddleware({
  target: 'https://siiadsyti.uatx.mx:8743/siia-back-tutorias-tesis-0.0.1-SNAPSHOT',
  changeOrigin: true,
  onProxyRes: function(proxyRes, req, res) {
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  },
}));

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
