const express = require("express")
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express()
const connectMongo = require("./database/connectDatabase")
const superAdminRoutes = require("./router/superAdminRouter")
require('dotenv').config();
const cors = require("cors");

const PORT = process.env.PORT;
const corsOptions ={
  origin:'http://localhost:3002', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(express.json());
app.use(cors(corsOptions));


// Mount the API routes
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/super_admin", superAdminRoutes);

connectMongo()

app.get("/", (req, res) => {
  
    res.send({success: "User Server is Working Perfectly"});
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
