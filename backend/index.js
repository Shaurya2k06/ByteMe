const express = require('express');
const cors = require('cors')
const {connectMongoDB} = require('./utility/connection')
const UserRouter = require('./routes/UserRouter')
const PublicRouter = require('./routes/PublicRouter')
const EventRouter = require('./routes/EventRouter')
const ShopRouter = require('./routes/ShopRouter')
const PaymentRouter = require('./routes/PaymentRouter')
const {jsonParser} = require('./middlewares/index')

const mongoURI = process.env.MONGO_URI;

const app = express();
const PORT = 9092;


connectMongoDB(mongoURI)

.then(() => console.log("MongoDB Connected!!"))
.catch(err => console.log("Error, Can't connect to DB", err));

app.use(jsonParser());

app.use(cors({ origin: 'https://www.uni-byte.tech', credentials: true }));

app.use("/user",  UserRouter)

app.use("/public", PublicRouter)

app.use("/events", EventRouter)

app.use("/shop", ShopRouter)

app.use("/fee", PaymentRouter)


app.listen(PORT, () => console.log("Server has been started on Port :" + PORT));
