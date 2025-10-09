const {connect} = require("mongoose");
require ("dotenv").config();

const db = () =>{
    connect(process.env.MONGODB_URI)
      .then(() => console.log("Mongodb Connected...."))
      .catch(() => {
        console.log("Error while connecting the MOngoDB");
      });

}
module.exports = db;