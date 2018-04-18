import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { router as userRouter } from './user/user.router';
import { tokenGuard } from './middlewares/token-guard';

const app = express();
const port = 4001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', userRouter);

app.get('/resource-01', (req, res, next) => {
    res.json('Hello World from Typescript!!!');
});

app.get('/protected-resource-01', tokenGuard(), (req, res, next) => {
    res.json('(Protected) Hello World from Typescript!!!');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = { message: 'Not Found', status: 404 };
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

app.listen(port, () => {
    console.log(`App is listening on Port: ${port}`);
})