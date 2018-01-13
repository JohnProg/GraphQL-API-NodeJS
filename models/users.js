import mongoose from 'mongoose';
import validate from 'mongoose-validator';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'This field is required'],
    validate: [
      validate({
        validator: 'isLength',
        arguments: [6, 15],
        message: 'The username must have a max length between {ARGS[0]} and {ARGS[1]}',
      }),
      validate({
        validator: 'isAlphanumeric',
        message: 'The username must be alphanumeric',
      }),
    ],
  },
  password: String,
  fullname: String,
  desc: String,
  bio: String,
  email: {
    type: String,
    validate: validate({
      validator: 'isEmail',
      message: 'This is not a valid email',
    }),
  },
  thumbnail: 'String',
  posts: {
    type: [],
    default: [],
  },
  following: {
    type: [],
    default: [],
  },
  followers: {
    type: [],
    default: [],
  },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
