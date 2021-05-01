const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017',{
    useNewUrlParser: true , useUnifiedTopology:true ,useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err =>console.log('err...') )

app.get('/', (req, res) => {
  res.send('Hello World! 한글한글')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})