const express = require('express');
const cors = require('cors')
const { connectMongoDB } = require('./utility/connection')
const UserRouter = require('./routes/UserRouter')
const PublicRouter = require('./routes/PublicRouter')
const EventRouter = require('./routes/EventRouter')
const ShopRouter = require('./routes/ShopRouter')
const PaymentRouter = require('./routes/PaymentRouter')
const QrRouter = require('./routes/QrRouter')
// const BiometricRouter = require('./routes/BiometricRouter')
const { jsonParser } = require('./middlewares/index');
const { verifyUserAuth } = require('./Service/authService');

const mongoURI = process.env.MONGO_URI;

const app = express();
const PORT = 9092;


connectMongoDB(mongoURI)
  .then(() => console.log("MongoDB Connected!!"))
  .catch(err => console.log("Error, Can't connect to DB", err));

app.use(jsonParser());

app.use(cors({ origin: ['https://www.uni-byte.tech', 'http://localhost:5173'], credentials: true }));

app.use("/user", UserRouter)

app.use("/public", PublicRouter)

app.use("/events", EventRouter)

app.use("/shop", ShopRouter)

app.use("/fee", PaymentRouter)

app.use("/qr", QrRouter)

<<<<<<< Updated upstream

=======
let i = 0;
app.use("/api/ping", (req, res) => {
    console.log(i++)
    return res.status(200).json({message: "huhh???"})
})
>>>>>>> Stashed changes
// app.use("/biometric", BiometricRouter)


app.listen(PORT, () => console.log("Server has been started on Port :" + PORT));
