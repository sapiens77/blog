import Router from 'koa-router';
import posts from './posts';
import auth from './auth';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

// api.get('/test', ctx => {
//   ctx.body = 'test 성공';
// });

// 라우터를 내보낸다.
export default api;

/**
 * [라우트-모듈화]
 * 프로젝트를 진행하다 보면 여러 종류의 라우트를 만들게 된다. 하지만 각 라우트를 index.js 파일 하나에 모두 작성하면, 코드가 너무 기러질 뿐 아니라 유지 보수하기도 힘들다
 * 여기서는 라우터를 여러 파일에 분리 시켜서 작성하고, 이를 불러와 적용하는 방법을 알아보자
 *
 * 기존 라이터는 제거를 하고
 * api라우터를 서버의 메인 라우터 /api경로로 설정
 */
