// lib/auth/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ADD THIS FOR DEBUGGING
console.log('JWT_SECRET exists:', !!JWT_SECRET);
console.log('JWT_SECRET length:', JWT_SECRET?.length);

export function generateTokens(user) {
     console.log('Generating token for user:', user.id, user.role);

     const accessToken = jwt.sign(
          {
               id: user.id,
               email: user.email,
               role: user.role,
               name: user.name
          },
          JWT_SECRET,
          { expiresIn: '1d' } // Note: 1 day expiration for access token
     );

     const refreshToken = jwt.sign(
          { id: user.id },
          JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
     );

     return { accessToken, refreshToken };
}

export function verifyAccessToken(token) {
     try {
          console.log('Verifying token with secret length:', JWT_SECRET?.length);
          const decoded = jwt.verify(token, JWT_SECRET);
          console.log('Token verified successfully:', decoded.id, decoded.role);
          return decoded;
     } catch (error) {
          console.log('Token verification failed:', error.message);
          return null;
     }
}

export function verifyRefreshToken(token) {
     try {
          return jwt.verify(token, JWT_REFRESH_SECRET);
     } catch (error) {
          return null;
     }
}