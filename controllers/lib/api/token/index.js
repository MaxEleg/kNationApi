'use strict';

function formatWebAuth(user, token) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    token: token.id,
    isAuth: user.id !== undefined,
  };
}

module.exports = {
  formatWebAuth,
};
