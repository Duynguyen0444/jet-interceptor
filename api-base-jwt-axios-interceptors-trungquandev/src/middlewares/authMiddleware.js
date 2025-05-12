import { StatusCodes } from 'http-status-codes'
import { ACCESS_TOKEN_SECRET_SIGNATURE, JwtProvider } from '~/providers/JwtProvider'

// Lấy và xác thực JWT accessToken từ FE có hợp lệ hay không.

const isAuthorized = async (req, res, next) => {
  // Method 1: Retrieve the accessToken from the client's request cookies - withCredentials in the authorizeAxios file and credentials in CORS
  const accessTokenFromCookie = req.cookies?.accessToken
  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Token not found' })
    return
  }

  // Method 2: Retrieve the accessToken in case the FE stores it in LocalStorage and sends it through the authorization header
  // const accessTokenFromHeader = req.headers.authorization
  // if (!accessTokenFromHeader) {
  //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Token not found' })
  //   return
  // }

  try {
    // Step 1: Decode the token to check if it is valid
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      // accessTokenFromHeader.substring('Bearer '.length),
      ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // Step 2: Important: If the token is valid, store the decoded information in req.jwtDecoded for processing in subsequent layers
    req.jwtDecoded = accessTokenDecoded

    // Step 3: Allow the request to proceed
    next()
  } catch (error) {
    // Error 1: If the accessToken has expired, return the status code GONE - 410 to inform the FE to call refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Token expired! Please refresh token' })
      return
    }

    // Error 2: If the accessToken is invalid, return the status code UNAUTHORIZED - 401 for the FE to handle Logout
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Please login' })
  }
}

export const authMiddleware = {
  isAuthorized
}