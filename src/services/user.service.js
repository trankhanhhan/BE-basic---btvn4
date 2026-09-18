import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  getUserByEmailFromDB,
  createUserInDB,
  updateRefreshToken,
  findByRefreshToken,
  getAllUsersFromDB
} from '../repositories/mock.data.js';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async ({ fullName, email, password, role = 'user' }) => {
  const existingUser = await getUserByEmailFromDB(email);
  if (existingUser) {
    const error = new Error('Email đã được sử dụng');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUserInDB({
    fullName,
    email,
    role,
    password_hash: hashedPassword
  });

  const tokens = generateTokens({ id: newUser.id, role: newUser.role });
  await updateRefreshToken(newUser.id, tokens.refreshToken);

  return {
    user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: newUser.role },
    ...tokens
  };
};

export const login = async ({ email, password }) => {
  const user = await getUserByEmailFromDB(email);
  if (!user) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.status = 401;
    throw error;
  }

  const tokens = generateTokens({ id: user.id, role: user.role });
  await updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    ...tokens
  };
};

export const logout = async (userId) => {
  // Xóa Refresh Token để thu hồi quyền
  await updateRefreshToken(userId, null);
};

export const refreshToken = async (token) => {
  if (!token) {
    const error = new Error('Thiếu Refresh Token');
    error.status = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    const error = new Error('Refresh Token không hợp lệ hoặc đã hết hạn');
    error.status = 403;
    throw error;
  }

  const user = await findByRefreshToken(token);
  if (!user || user.id !== decoded.id) {
    const error = new Error('Refresh Token đã bị thu hồi hoặc không hợp lệ');
    error.status = 403;
    throw error;
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  return { accessToken };
};

export const getUsers = async () => {
  const users = await getAllUsersFromDB();
  return users.map(({ password_hash, refresh_token, ...safeUser }) => safeUser);
};