import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
// import solutionRouter from './routes/solutionRouter.js';
// import problemRouter from './routes/problemRouter.js';
// import commentRouter from './routes/commentRouter.js';
// import likeRouter from './routes/likeRouter.js';

const app = express();

app.use(cors({
  origin: [String(process.env.CORS_ORIGIN)],
  methods: ["POST", "GET"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.json("This is great");
});

app.use('/users', userRouter);
// app.use('/solutions', solutionRouter);
// app.use('/problems', problemRouter);
// app.use('/comments', commentRouter);
// app.use('/likes', likeRouter);

export default app;