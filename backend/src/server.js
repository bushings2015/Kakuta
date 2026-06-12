const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PORT } = require('./utils/constants');
const { initializeAdminUser } = require('./controllers/authController');
const routRouter = require('./routes/index');
const prisma = require('./config/db');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "https://kakutausa.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use('/api', routRouter);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    await initializeAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
