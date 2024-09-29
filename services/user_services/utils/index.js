const setCookie = async (cookies, user, User, newRefreshToken, res) => {
  //   clear jwt cookie from user if exist
  let newRefreshTokenArray = !cookies?.jwt
    ? user?.refreshTokens
    : user?.refreshTokens.filter((token) => {
        return token !== cookies?.jwt;
      });

  //   check user hacked
  if (cookies?.jwt) {
    const foundUserWithToken = await User.getUserByToken(cookies?.jwt);
    if (!foundUserWithToken) newRefreshTokenArray = [];
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
  }

  user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
  await user.save();

  //   save cookie in user browser
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 15,
  });
};

module.exports = { setCookie };
