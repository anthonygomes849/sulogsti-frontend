import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Para trabalhar com __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve os arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'dist')));

// Redireciona todas as outras rotas para o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});