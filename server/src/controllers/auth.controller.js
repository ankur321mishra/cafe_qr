import * as authService from '../services/auth.service.js';
import { success, created } from '../utils/apiResponse.js';
import config from '../config/index.js';
import { parseExpiry } from '../utils/jwt.js';

const REFRESH_COOKIE_NAME = 'brewhouse_refresh_token';

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'strict' : 'lax',
    path: '/api/v1/auth',
    maxAge: parseExpiry(config.jwt.refreshExpiry),
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'strict' : 'lax',
    path: '/api/v1/auth',
  });
}

export async function register(req, res) {
  const result = await authService.register(req.body);

  const loginResult = await authService.login({
    email: req.body.email,
    password: req.body.password,
  });

  setRefreshCookie(res, loginResult.refreshToken);

  return created(res, {
    user: loginResult.user,
    accessToken: loginResult.accessToken,
  }, 'Registration successful');
}

export async function login(req, res) {
  const result = await authService.login(req.body);

  setRefreshCookie(res, result.refreshToken);

  return success(res, {
    user: result.user,
    accessToken: result.accessToken,
  }, 'Login successful');
}

export async function refresh(req, res) {
  const oldToken = req.cookies[REFRESH_COOKIE_NAME];
  const result = await authService.refresh(oldToken);

  setRefreshCookie(res, result.refreshToken);

  return success(res, {
    user: result.user,
    accessToken: result.accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
  await authService.logout(refreshToken);

  clearRefreshCookie(res);

  return success(res, null, 'Logged out successfully');
}

export async function getMe(req, res) {
  const user = await authService.getMe(req.user.id);
  return success(res, user);
}

export async function getStaff(req, res) {
  const staff = await authService.getStaffList();
  return success(res, staff);
}

export async function createStaff(req, res) {
  const newStaff = await authService.createStaff(req.body);
  return created(res, newStaff, 'Staff account created successfully');
}
