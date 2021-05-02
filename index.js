const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const User = require("./models/User");
//const auth = require('./middleware/auth')

//application/x-www-form-urlencoded 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }))

//application/json 분석해서 가져옴
app.use(bodyParser.json())


const config = require('./config/key')

const mongoose = require('mongoose')




//mongoose.connect('mongodb://localhost:27017',{
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  userCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('err...'))

app.get('/', (req, res) => {
  res.send('Hello World! 다 잘될것이다! 화이팅')
})

app.post("/register", (req, res) => {

  //회원가입할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이타베이스에 넣어준다


  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true

    })
  })
})

app.post('api/users/login', (req, res) => {
  //요청된 email이 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {//없는경우
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.'
      })
    }
    //요청된 email이 있다면, 비밀번호가 맞는 비밀번호인지 확인.
    //아래에서 만든 메소드를 사용한다
    user.comparePassword(req.body.password, (err, isMatch) => {
      //비밀번호가 같지 않는경우
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })
      }
      //비밀번호까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)//클라이언트에게 에러 전달

        //토큰을 저장한다. 어디? 쿠키,로컬스토리지 등등 가능
        //어디에 저장하는게 안전한지는 논란이많음. 지금은 일단 쿠키에 저장
        //쿠키에 저장하기 위해서는 라이브러리를 설치해야한다. cookieParser

        //이렇게 하면 x_auth라는 이름에 토큰이 들어감.  x_auth말고 다른이름도 가능
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginsuccess: true, userId: user._id })


      })

    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {

})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`




  )
})