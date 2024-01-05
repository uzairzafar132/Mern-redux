const express = require('express');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const cors = require('cors');
const authRouter = require('./routes/userRoutes');
const pool = require("./db")
const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));


  app.get('/', (req, res, next) => {
    res.status(200).send('Hello world! We are running under HTTPS!');
  });


  app.post('/todos',async (req,res)=>{
    
    const userCredentials=req.body;
    console.log(userCredentials.email)
        try{
       const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1',[userCredentials.email])
       console.log(todos.rows)
        res.json(todos.rows)
    }catch(err){
        console.error(err)
    }
  })

  app.use('/auth',authRouter );

  app.use(notFound);
  app.use(errorHandler);






  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });