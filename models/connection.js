import mongoose from 'mongoose';
// const dbURI = "mongodb://127.0.0.1:27017/proparts";
const dbURI = "mongodb+srv://vikashjoshi187:UJ3apw5hsFiuxDDu@cluster0.zujvwbx.mongodb.net/proparts";

mongoose.connect(dbURI,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection Failed" + err);
  });

export default mongoose;