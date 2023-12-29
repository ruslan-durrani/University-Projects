const express = require("express")
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express()
const connectMongo = require("./database/connectDatabase")
const userRoutes = require("./router/userRouter")
require('dotenv').config();
const cors=require("cors");
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use("/user", userRoutes);

connectMongo()

app.get("/", (req, res) => {
  
    res.send({success: "User Server is Working Perfectly"});
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
