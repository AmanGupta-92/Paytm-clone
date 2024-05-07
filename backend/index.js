import { express } from 'express'
import { cors } from 'cors'
const routeRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', routeRouter);

app.use('/api/v1/user', userRouter);

app.listen(3000);