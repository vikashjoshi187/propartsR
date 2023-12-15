import express from'express';
import cookieParser from 'cookie-parser';
import customer from './routes/customer.js';
import admin    from './routes/admin.js';
import seller   from './routes/seller.js';
import { Server } from 'socket.io';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3100

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));



app.set('view engine','ejs');
app.set('views','views');

app.use('/', customer);
app.use('/admin', admin);
app.use('/seller', seller);

const expressServer=app.listen(PORT,()=>{
  console.log('server is running  : http://localhost:3100');
});



const io = new Server(expressServer, {
  cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
  }
})


io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)
  socket.on('send-message', data => {
      console.log(data)
      socket.broadcast.emit('send-message', `${data}`)
  })
})




