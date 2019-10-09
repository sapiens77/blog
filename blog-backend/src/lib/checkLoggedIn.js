const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.state = 401;
    return;
  }
  return next();
};

export default checkLoggedIn;
