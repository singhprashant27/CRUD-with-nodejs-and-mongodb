const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const Userdb = require('./server/model/model')

const connectDB = require('./server/database/connection');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// load routers
app.use('/', require('./server/routes/router'))

app.post("/login", async function(req, res){
    try {
        const password = req.body.password;
        console.log(password)
        // check if the user exists
        const user = await Userdb.findOne({ email: req.body.email });
        console.log(user)
        if (user) {
          //check if password matches
          const result = password == user.password;
          console.log(result)
          if (result) {
            res.render('home')
          } else {
            // req.flash('error', 'password doesnt match')
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});