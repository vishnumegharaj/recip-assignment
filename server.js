const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const userRoute = require("./routes/auth.js")
const app = express()


app.use(cors())
app.use(express.json({ limit: '10mb' }));       
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/users", userRoute)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
    console.log("Failed to connect to MongoDB");
})