const express = require('express');
const path = require('path');
const app = express();

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] }));

app.get('/api/hello', (req, res) => res.json({ ok: true, message: 'Hello from Render!' }));

app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
