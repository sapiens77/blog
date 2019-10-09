import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

// const printInfo = ctx => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

// posts라우트에 여러 종류의 라우트를 설정한 후 모두 printInfo 함수를 호출하도록 설정하고, 문자열이 아닌 JSON 객체를 반환하도록 설정. 이 객체에는 현재 요청의 메서드,경로, 파라미터를 담았다.
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write); // 로그인 체크 미들웨어 적용

const post = new Router();

post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove); // 본인 작성 포스트만 삭제가능 - postsCtrl.checkOwnPost 추가
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update); // 본인 작성 포스트만 수정가능 - postsCtrl.checkOwnPost 추가

posts.use('/:id', postsCtrl.getPostById, post.routes()); // checkObjectId => getPostById 변경 - ObjectId 검증

export default posts;
