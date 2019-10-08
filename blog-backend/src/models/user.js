import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function(password) {
  // 인스턴스 메서드를 작성할 때는 화살표 함수가 아닌 function 키워드를 사용하여 구현해야 한다.
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash; // 함수 내부에서 this에 접근해야 하기 때문인데, 여기서 this는 문서 인스턴스를 가리킨다.
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true /false
};

UserSchema.methods.serialize = async function() {
  const data = this.toJSON();
  // console.log(data.hashedPassword);
  delete data.hashedPassword;
  // console.log(data);
  return data;
};

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username }); // 스태틱 함수에서는 this는 모델을 가리킨다. 지금 여기서는 USER를 가르킨다.
};

const User = mongoose.model('User', UserSchema);
export default User;
