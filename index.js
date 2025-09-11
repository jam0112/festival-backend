const express = require('express');
const app = express();

// 일부러 만든 에러: 따옴표를 닫지 않았습니다.
console.log("이것은 의도적인 에러입니다); 

app.use(express.static('public'));
app.use(express.json()); 

const visitors = [];

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

app.get('/visitors', (req, res) => {
    res.json(visitors);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});