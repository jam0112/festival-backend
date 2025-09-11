// 1. 필요한 라이브러리들을 불러옵니다.
require('dotenv').config(); // dotenv를 가장 먼저 실행
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. 데이터베이스에 연결합니다.
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ 데이터베이스에 성공적으로 연결되었습니다.'))
  .catch(e => console.error('❌ 데이터베이스 연결에 실패했습니다:', e));

// 3. '방문객' 데이터의 형태(Schema)를 정의합니다.
const visitorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    number: String,
    gender: String,
    age_group: String,
    region: String,
    registeredAt: { type: Date, default: Date.now }
});

// 4. 위 Schema를 기반으로 실제 데이터를 다룰 모델(Model)을 만듭니다.
const Visitor = mongoose.model('Visitor', visitorSchema);

// Middleware 설정
app.use(express.static('public'));
app.use(express.json());

// API: 모든 방문객 목록 조회
app.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ registeredAt: -1 }); // DB에서 모든 방문객을 최신순으로 찾기
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API: 방문객 등록
app.post('/register', async (req, res) => {
    const { name, number, gender, age_group, region } = req.body;

    const newVisitor = new Visitor({ // 새 방문객 모델 인스턴스 생성
        name,
        number,
        gender,
        age_group,
        region
    });

    try {
        const savedVisitor = await newVisitor.save(); // DB에 저장
        console.log('새로운 방문객 등록:', savedVisitor);
        res.status(201).json(savedVisitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});