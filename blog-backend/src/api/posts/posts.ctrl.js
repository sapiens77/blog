import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

/** 역할이 무엇??
 * ObjectId 검증 - 요청을 검증하는 방법, 앞서 read API를 실행할 대, id가 올바른 ObjectId 형식이 아니면 500 오류가 발생했다.
 * 500오류는 보통 서버에서 처리하지 않아 내부적으로 문제가 생겼을 때 발생한다.
 * 잘못된 id를 전달했다면 클라이언트가 요청을 잘못 보낸 것이니 400 Bad Request 오류를 띄워 주는것이 맞다.
 * 그러려면 id 값이 올바른 ObjextId 인지 확인해야 하는데, 이를 거증하는 형식은 다음과 같다.
 *
 * @param {*} ctx
 * @param {*} next
 */
// checkObjectId => getPostById 변경
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    console.log(post);
    //포스트가 존재하지 않으면
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    console.log(e);
    ctx.throw(500, e);
  }
};

// 이 미들웨어는 id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트인지 확인해 준다. 만약 사용자의 포스트가 아니라면 403에러발생
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    // 몽고디비에서 조회한 데이터의 id 값을 문자열과 비교할 때는 반드시, .toString()을 해주어야 한다.
    ctx.state = 403;
    return;
  }
  return next();
};

export const write = async ctx => {
  const schema = Joi.object().keys({
    title: Joi.string().required(), // required()가 있으면 필수항목
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = async ctx => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다. 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));

    ctx.body = posts
      .map(post => post.toJSON())
      .map(post => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

// export const read = async ctx => {
//   const { id } = ctx.params;
//   try {
//     const post = await Post.findById(id).exec();
//     if (!post) {
//       ctx.status = 404;
//       return;
//     }
//     ctx.body = post;
//   } catch (e) {
//     ctx.throw(500, e);
//   }
// };

// 위 read 함수 간소화 하면

export const read = ctx => {
  ctx.body = ctx.state.post;
};

export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const replace = ctx => {
  const { id } = ctx.params;
  const index = posts.findIndex(p => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};

export const update = async ctx => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string(), // required()가 있으면 필수항목
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 이후에 불러올때는   const 모듈이름 = require('파일이름');
// 모듈이름.이름()
