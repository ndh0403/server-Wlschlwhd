const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 전역 변수에 센서 데이터 저장, 기본값 off
let sensorData = {
  temperature: 'off',
  pH: 'off',
  salinity: 'off',
  light: 'off', // 조도
  lastUpdated: null
};

// 루트 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 센서 데이터 받는 엔드포인트
app.post('/update', (req, res) => {
  const { temperature, pH, salinity, light } = req.body;

  // 모든 값이 있으면 업데이트, 없으면 off 처리
  sensorData = {
    temperature: temperature ?? 'off',
    pH: pH ?? 'off',
    salinity: salinity ?? 'off',
    light: light ?? 'off',
    lastUpdated: Date.now()
  };

  res.json({ status: 'success', data: sensorData });
});

// 센서 데이터 전달 엔드포인트
app.get('/data', (req, res) => {
  const now = Date.now();
  const isOffline = !sensorData.lastUpdated || (now - sensorData.lastUpdated > 60 * 1000);

  res.json({
    temperature: isOffline ? 'off' : sensorData.temperature,
    pH: isOffline ? 'off' : sensorData.pH,
    salinity: isOffline ? 'off' : sensorData.salinity,
    light: isOffline ? 'off' : sensorData.light,
    lastUpdated: sensorData.lastUpdated
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
