require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // 1. express-session 불러오기

const app = express();
const PORT = process.env.PORT || 3000;

// 2. 세션 미들웨어 설정
app.use(session({
    secret: process.env.SESSION_SECRET, // 세션 암호화를 위한 비밀키
    resave: false,                      // 세션이 변경되지 않아도 항상 저장할지 여부
    saveUninitialized: false,           // 초기화되지 않은 세션을 저장소에 저장할지 여부
    cookie: {
        secure: false, // https가 아닌 환경에서도 쿠키 사용 가능
        maxAge: 1000 * 60 * 60 // 쿠키 유효 기간 (1시간)
    }
}));

// 데이터베이스 연결
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ 데이터베이스에 성공적으로 연결되었습니다.'))
  .catch(e => console.error('❌ 데이터베이스 연결에 실패했습니다:', e));

// ... (이하 모델 정의 및 미들웨어 설정은 이전과 동일) ...

const visitorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String, number: String, gender: String,
    age_group: String, region: String,
    registeredAt: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

app.use(express.static('public'));
app.use(express.json());

// --- API 라우트 ---

// 3. (여기에 로그인/로그아웃, 접근제어 로직이 추가될 예정입니다)


// 방문객 조회 API
app.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ registeredAt: -1 });
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 방문객 등록 API
app.post('/register', async (req, res) => {
    try {
        const { name, number, gender, age_group, region } = req.body;
        const newVisitor = new Visitor({ name, number, gender, age_group, region });
        const savedVisitor = await newVisitor.save();
        console.log('새로운 방문객 등록:', savedVisitor);
        res.status(201).json(savedVisitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});