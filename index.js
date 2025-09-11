const express = require('express');
const app = express();

// 'public' 폴더에 있는 파일들을 웹페이지로 제공하겠다는 설정
app.use(express.static('public'));

// JSON 데이터를 사용하기 위한 설정 추가
app.use(express.json()); 

// 방문객 데이터를 저장할 임시 공간
const visitors = [];

// API: 방문객 등록
app.post('/register', (req, res) => {
  const { name, number, gender, age_group, region } = req.body;
  
  const newVisitor = {
      id: visitors.length + 1,
      name: name,
      number: number,
      gender: gender,
      age_group: age_group,
      region: region,
      registeredAt: new Date()
  };
  
  visitors.push(newVisitor);
  console.log('새로운 방문객 등록:', newVisitor);
  res.status(201).json(newVisitor);
});

// API: 모든 방문객 목록 조회
app.get('/visitors', (req, res) => {
    res.json(visitors);
});

// 서버 실행 (항상 맨 아래에 위치)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});