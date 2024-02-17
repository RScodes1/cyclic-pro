const express = require('express');
const app = express();
require('dotenv').config();
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const { noteRouter } = require('./routes/note.routes');



app.get('/', (req, res) => {
    res.send({"msg": "hi to the server"});
});

app.use(express.json());
app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB");
        console.log(`The server is running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
