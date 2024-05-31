const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const helper = require("./app/helper/ApplicationHelper");

require("dotenv").config();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

const db = require("./app/models");

db.sequelize.sync();

app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.text({ limit: '200mb' }));

require("./app/routes/UserAccount.routes")(app);
require("./app/routes/Package.routes")(app);

app.get("/", (req, res) => {
    res.status(403);
    res.send("Forbidden!");
});


const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// const io = socket(server);