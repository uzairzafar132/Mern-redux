// const express = require("express");
// const bodyParser = require("body-parser");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();
// const cors = require("cors");
// const authRouter = require("./routes/userRoutes");
// const pool = require("./db");
// const http = require('http');
// const app = express();
// const { Server } = require("socket.io");
// const server = http.createServer(app);
// app.use(cookieParser());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });
// });

// app.get("/", (req, res, next) => {
//   res.status(200).send("Hello world! We are running under HTTPS!");
// });

// app.post("/todos", async (req, res) => {
//   const userCredentials = req.body;
//   console.log(userCredentials.email);
//   try {
//     const todos = await pool.query(
//       "SELECT * FROM todos WHERE user_email = $1",
//       [userCredentials.email]
//     );
//     console.log(todos.rows);
//     res.json(todos.rows);
//   } catch (err) {
//     console.error(err);
//   }
// });

// app.use("/auth", authRouter);

// app.use(notFound);
// app.use(errorHandler);

// const port = process.env.PORT || 8080;

// server.listen(port, () => {
//   console.log(`Server is listening on http://localhost:${port}`);
// });


const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./db")
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // Fetch and send the chat history to the connected user
    pool.query(`SELECT * FROM messages WHERE room = $1`, [data], (error, result) => {
      if (error) {
        console.error("Error fetching chat history:", error);
      } else {
        socket.emit("chat_history", result.rows);
      }
    });
  });

  socket.on("send_message", (data) => {
    // Save the message in PostgreSQL
    pool.query(
      `INSERT INTO messages (room, message) VALUES ($1, $2) RETURNING *`,
      [data.room, data.message],
      (error, result) => {
        if (error) {
          console.error("Error saving message:", error);
        } else {
          const savedMessage = result.rows[0];
          socket.to(data.room).emit("receive_message", savedMessage);
        }
      }
    );
  });
});

server.listen(8080, () => {
  console.log("SERVER IS RUNNING");
});