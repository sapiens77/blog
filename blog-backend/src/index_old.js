// 서버 띄우기

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== '1') {
    // 지금은 단순히 주소의 쿼리 파라미터를 사용하여 조건부로 처리했지만, 나중에 웹 요청의 쿠키 혹은 헤더를 통해 처리할 수도 있다.
    ctx.status = 401; //Unauthorized
    return;
  }
  await next();
  console.log('END ==');
  //   next().then( () => {
  //     console.log('END');
  //   }); // next함수는 promise를 반환한다. - 이는 Koa가 Express와 차별화 되는 지점. next함수가 반환하는  Promise는  다음에 처리해야할 미들웨어가 끝나야 완료된다.
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use(ctx => {
  ctx.body = 'hello world';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});

/**
 * Koa 애플리케이션은 미들웨어의 배열로 구성되어 있다. app.use 함수는 미들웨어 함수를 애플리케이션에 등록한다.
 * 미들웨어 함수는 다음과 같은 구조로 이루어져 있다.
 *
 * ( ctx, next ) => {
 * }
 *
 * Koa의 미들웨어 함수는 두개의 파라미터를 받는다. 첫 번째 파라미터는 ctx라는 값이고, 두 번째 파라미터는 next이다.
 *
 * ctx는 [context의-줄임말]로 [웹-요청과-응답]에 관한 정보를 지니고 있다.
 * next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수이다. 미들웨어를 등록하고 next 함수를 호출하지 않으면, 그다음 미들웨어를 처리하지 않는다.
 */
