const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

require('./config/db');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const recordingRoutes = require('./routes/recordingRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/recordings', recordingRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);

const socketUtil = require('./utils/socket');
socketUtil.init(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
