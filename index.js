require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// 세션 미들웨어 설정
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto', 
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// 데이터베이스 연결
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ 데이터베이스에 성공적으로 연결되었습니다.'))
  .catch(e => console.error('❌ 데이터베이스 연결에 실패했습니다:', e));

// 모델 정의
const Visitor = mongoose.model('Visitor', new mongoose.Schema({
    name: String, number: String, gender: String,
    age_group: String, region: String,
    registeredAt: { type: Date, default: Date.now }
}));

// JSON 파싱 미들웨어
app.use(express.json());

// --- 보안 및 인증 로직 (정적 파일보다 먼저 와야 함) ---

const checkAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

app.post('/login', (req, res) => {
    const ADMIN_USER = { username: 'admin', password: 'password123' };
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        req.session.isLoggedIn = true;
        res.status(200).json({ message: '로그인 성공' });
    } else {
        res.status(401).json({ message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('로그아웃 실패');
        res.redirect('/login.html');
    });
});

// ✨✨✨ 핵심 변경사항 ✨✨✨
// 특별 규칙인 '/admin.html' 보안 검사를 먼저 배치합니다.
app.get('/admin.html', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// 그 다음에 일반 규칙인 'public' 폴더 서비스를 배치합니다.
app.use(express.static('public'));


// --- 기존 방문객 API ---

app.get('/visitors', checkAuth, async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ registeredAt: -1 });
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const newVisitor = new Visitor(req.body);
        const savedVisitor = await newVisitor.save();
        res.status(201).json(savedVisitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});