const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const User = require('../../models/user');
const User = mongoose.model('User');

module.exports = {
  createUser: async args => {
    const { email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      // eslint-disable-next-line no-shadow
      const user = new User({
        email,
        password: hashedPassword,
      });
      const result = await user.save();
      return {
        ...result._doc,
        password: 'null',
        _id: result.id,
      };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'setemi', {
      expiresIn: '1h',
    });

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
