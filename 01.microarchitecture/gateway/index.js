const express = require('express');
const cors = require('cors');

// gateway로 오는 req를 microservice들(customer, products, shopping)로 리다이렉트 해준다
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json());

// proxy로 요청 분기 처리
app.use('/customer', proxy('http://localhost:8001'));
app.use('/shopping', proxy('http://localhost:8003'));
app.use('/', proxy('http://localhost:8002')); // products

app.listen(8000, () => {
  console.log('Gateway is Listening to Port 8000');
});
