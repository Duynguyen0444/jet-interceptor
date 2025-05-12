// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { ACCESS_TOKEN_SECRET_SIGNATURE, JwtProvider, REFRESH_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123'
  },
}


const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // In case the account information is correct, generate a token and return it to the Client
    // Create payload information to attach in the JWT token
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    }

    // Create access token + refresh token
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ms('1h')
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      ms('14 days')
    )

    /**
     * Handle the case of returning an HTTP-only cookie for the browser
     * maxAge
     * maxAge - The maximum lifespan of the cookie is 14 days. Note that the lifespan of the cookie is different from the lifespan of the token.
     */

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie(refreshToken, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Return user information as well as Tokens for the browser to store tokens in localStorage
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: ' Refresh Token API success.' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken,
}
