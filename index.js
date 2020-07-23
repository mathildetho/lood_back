const express = require('express');
const app = express();
const api = require("./routes");
require('dotenv').config();
const port = process.env.NODE_ENV_PORT || 3000;
const fileUpload = require('express-fileupload');
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

// UPLOAD FILE
//to access the files in public folder
app.use(express.static('public'));
app.use(fileUpload());
// file upload api
app.post('/upload', (req, res) => {
   if (!req.files) {
       return res.status(500).send({ msg: "file is not found" })
   }
   // accessing the file
   const myFile = req.files.file;
   // mv() method places the file inside public directory
   myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
       if (err) {
           console.log(err)
           return res.status(500).send({ msg: "Error occured" });
       }
       // return the response with file path and name
       return res.send({name: myFile.name, path: `/${myFile.name}`});
   });
})

app.listen(port, (err) => {
  if(err){
    throw new Error('Something bad happened');
  }
  console.log(`Server listening on port ${port}`);
});