import ms from "ms";

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN || "2h"),
  });
}
