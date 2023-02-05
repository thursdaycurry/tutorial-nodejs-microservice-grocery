const express = require('express');
const cors = require('cors');
const { customer, appEvents } = require('./api');
const HandleErrors = require('./utils/error-handler');

module.exports = async (app) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(__dirname + '/public'));

  // 이벤드 리스너
  appEvents(app);

  //api 라우트
  customer(app);
  // products(app);
  // shopping(app);

  // 전역 error handling
  app.use(HandleErrors);
};
