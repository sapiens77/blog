import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

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
posts.post('/', postsCtrl.write);

const post = new Router();

post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.remove);
post.patch('/', postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());

export default posts;
