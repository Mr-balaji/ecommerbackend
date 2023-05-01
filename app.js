const express = require('express');
const app = express();
require("./db/conn")
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const cors = require("cors");



app.use(express.json());
app.use(cors())
app.use(require("./routes/routes"))
dotenv.config();


app.use("/uploads",express.static('uploads'));





// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
