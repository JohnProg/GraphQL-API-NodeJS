import bcrypt from 'bcrypt';
import auth from './../auth';
import Formatter from './../utils/formatter';

export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.find(),
    getUser: (parent, args, { models }) => models.User.findOne(args),
  },
  Mutation: {
    login: async (parent, { email, password }, { models: { User }, SECRET }) => (
      auth.login(email, password, User, SECRET)
    ),
    createUser: async (parent, { password, ...args }, { models }) => {
      const otherErrors = [];
      try {
        if (password.length < 8) {
          otherErrors.push({ path: 'password', message: 'Password must be greater than 8 characters' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await models.User.create({ ...args, password: hashPassword });

        if (otherErrors.length) {
          throw otherErrors;
        }

        return {
          success: user && user._id,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          errors: Formatter.formatErrors(error, otherErrors),
        };
      }
    },
  },
};
