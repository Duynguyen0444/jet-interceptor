// Author: TrungQuanDev: https://youtube.com/@trungquandev
import JWT from 'jsonwebtoken'

/**
 * Function create token
 * @param {Object} userInfo - Payload to be signed
 * @param {string} secretSignature - Secret key for signing
 * @param {string} tokenLife - Expiration time for the token
 */

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Function to check if a token is valid
 * The token is created correctly with the secret key
 */

const verifyToken = async (token, secretSignature) => {
  try {
    // verify - Get from library jwt
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

export const JwtProvider = {
  generateToken,
  verifyToken
}
