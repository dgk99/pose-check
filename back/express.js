require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// CORS 설정
app.use(cors({
  origin: ["http://localhost:5173", "http://210.101.236.158.nip.io", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// 정적 파일 (업로드된 사진) 제공
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('서버 실행 중 (CORS 설정 완료)');
});

// 라우터 연결
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/user', userRoutes);

// 서버 실행
app.listen(5002, () => {
  console.log("서버 실행 중: http://localhost:5002");
});