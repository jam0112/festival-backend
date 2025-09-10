const express = require('express');
// 'public' 폴더에 있는 파일들을 웹페이지로 제공하겠다는 설정
app.use(express.static('public'));
const app = express();
const PORT = process.env.PORT || 3000;

// 1. JSON 데이터를 사용하기 위한 설정 추가
app.use(express.json()); 

// 2. 방문객 데이터를 저장할 임시 공간 (나중에는 DB로 대체)
const visitors = [];

// 3. 기본 접속 경로
app.get('/', (req, res) => {
res.json({ message: "🎉 축제 방명록 서버에 오신 것을 환영합니다!!! 🎉 #v2" });
});

// 4. 방문객 등록을 처리할 새로운 경로 (API)
app.post('/register', (req, res) => {
  // 클라이언트가 보낸 정보 (name, gender 등)를 받음
  const newVisitor = req.body;
  
  // 받은 정보에 고유 ID와 등록 시간 추가
  newVisitor.id = visitors.length + 1;
  newVisitor.registeredAt = new Date();
  
  // 임시 저장 공간에 새 방문객 정보 추가
  visitors.push(newVisitor);
  
  console.log('새로운 방문객 등록:', newVisitor);
  
  // 성공적으로 등록되었다는 응답과 함께 등록된 정보를 보내줌
  res.status(201).json(newVisitor);
});

// 5. 현재까지 등록된 모든 방문객 목록을 보여주는 경로
app.get('/visitors', (req, res) => {
    res.json(visitors);
});


app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});