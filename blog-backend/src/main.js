require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
//import createFakeData from './createFakeData';

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
    //createFakeData();
  })
  .catch(e => {
    console.log(e);
  });

const app = new Koa();
const router = new Router();

//라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

//라우터 적용 전에 bodyParser적용
app.use(bodyParser());

// router.get('/', ctx => {
//   ctx.body = '홈';
// });

// router.get('/about/:name?', ctx => {
//   const { name } = ctx.params;
//   ctx.body = name ? `${name}의 소개` : '소개';
// });

// router.get('/posts', ctx => {
//   const { id } = ctx.query;
//   ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
// });

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods);

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
