const express = require('express');
const {connectMongoDB} = require('./connection')
const UserRouter = require('./routes/UserRouter')
const PublicRouter = require('./routes/PublicRouter')
const EventRouter = require('./routes/EventRouter')
const {jsonParser} = require('./middlewares/index')

const app = express();
const PORT = 9092;

connectMongoDB("mongodb://127.0.0.1:27017/ByteMe")
.then(() => console.log("MongoDB Connected!!"))
.catch(err => console.log("Error, Can't connect to DB", err));

app.use(jsonParser());

app.use("/user",  UserRouter)

app.use("/public", PublicRouter)

app.use("/events", EventRouter)


app.listen(PORT, () => console.log("Server has been started on Port :" + PORT));
