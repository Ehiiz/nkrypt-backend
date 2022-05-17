const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');


const app = express();
 
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(checkUser);
app.use(requireAuth);



// database connection
const dbURI = 'mongodb://localhost:27017/kryptDB';
mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Data base connected")
  } )
  .catch((err) => console.log(err));

//routes
app.get('*', checkUser)
// app.get('/', (req, res) => res.render('home'));
// app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
// app.use(authRoutes);



app.listen(4000, ()=>{
  console.log(`Server is running on 4000`);
});
