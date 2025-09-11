require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt'); // bcrypt 불러오기

const app = express();
const PORT = process.env.PORT || 3000;

// --- 미들웨어 설정 ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', httpOnly: true, maxAge: 1000 * 60 * 60 }
}));
app.use(express.json());

// --- 데이터베이스 연결 ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ 데이터베이스에 성공적으로 연결되었습니다.'))
  .catch(e => console.error('❌ 데이터베이스 연결에 실패했습니다:', e));

// --- 모델(Schema) 정의 ---

// 1. User 모델 (새로 추가)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 2. Visitor 모델 (기존과 동일)
const Visitor = mongoose.model('Visitor', new mongoose.Schema({
    name: String, number: String, gender: String,
    age_group: String, region: String,
    registeredAt: { type: Date, default: Date.now }
}));


// --- 보안 및 인증 로직 ---

const checkAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// 로그인 로직 (DB에서 사용자 확인하도록 변경)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.isLoggedIn = true;
            res.status(200).json({ message: '로그인 성공' });
        } else {
            res.status(401).json({ message: '비밀번호가 잘못되었습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('로그아웃 실패');
        res.redirect('/login.html');
    });
});

// --- 페이지 라우팅 ---
app.get('/admin.html', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});
app.use(express.static('public'));

// --- 이용자 API (CRUD) ---
app.get('/visitors', checkAuth, async (req, res) => { /* 이전과 동일 */ });
app.post('/register', async (req, res) => { /* 이전과 동일 */ });
app.patch('/visitors/:id', checkAuth, async (req, res) => { /* 이전과 동일 */ });
app.delete('/visitors/:id', checkAuth, async (req, res) => { /* 이전과 동일 */ });


app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});