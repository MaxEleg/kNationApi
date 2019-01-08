'use strict';

function formatWebAuth(user, token) {
  let tkn =  {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    nickname: user.nickname,
    birthDate: user.birthDate,
    rank: user.rank,
    phone: user.phone,
    isAuth: user.id !== undefined,
    token: token.id,
  };
}

module.exports = {
  formatWebAuth,
};
