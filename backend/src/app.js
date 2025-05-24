import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
// import solutionRouter from './routes/solutionRouter.js';
// import problemRouter from './routes/problemRouter.js';
import commentRouter from './routes/comment.route.js';
import likeRouter from './routes/like.route.js';
import postRouter from './routes/post.route.js'

console.log(process.env.CORS_ORIGIN)
const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ["POST", "GET"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.json("This is great");
});

app.use('/users', userRouter);
app.use('/posts', postRouter);
// app.use('/problems', problemRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);

export default app;