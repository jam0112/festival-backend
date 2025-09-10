const express = require('express');
const app = express(); // app을 먼저 만들고

app.use(express.static('public')); // 그 다음에 사용

// JSON 데이터를 사용하기 위한 설정 추가
app.use(express.json()); 

// 방문객 데이터를 저장할 임시 공간 (나중에는 DB로 대체)
const visitors = [];

// 기본 접속 경로 ('/'는 이제 index.html을 보여주므로 이 코드는 사실상 예비용)
app.get('/', (req, res) => {
  res.send("서버가 작동중입니다. /index.html 페이지로 접속해주세요.");
});

// 방문객 등록을 처리할 새로운 경로 (API)
app.post('/register', (req, res) => {
  const newVisitor = req.body;
  newVisitor.id = visitors.length + 1;
  newVisitor.registeredAt = new Date();
  
  visitors.push(newVisitor);
  
  console.log('새로운 방문객 등록:', newVisitor);
  res.status(201).json(newVisitor);
});

// 현재까지 등록된 모든 방문객 목록을 보여주는 경로
app.get('/visitors', (req, res) => {
    res.json(visitors);
});

// 서버를 켭니다. (이 코드는 항상 맨 아래에 있어야 합니다.)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});