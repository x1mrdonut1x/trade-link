import {
  authFixtures,
  getProfile,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from '../../helpers/auth/auth.helper';

describe('Auth Refresh Token', () => {
  const testUser = authFixtures.testUser;
  let currentUserEmail: string;

  beforeEach(async () => {
    // Register a fresh user for each test
    currentUserEmail = `test-${Date.now()}@example.com`;
    await registerUser({
      ...testUser,
      email: currentUserEmail,
    });
  });

  describe('POST /auth/refresh', () => {
    it('should successfully refresh access token with valid refresh token', async () => {
      // Login to get tokens
      const loginResponse = await loginUser(currentUserEmail, testUser.password);
      expect(loginResponse.access_token).toBeDefined();
      expect(loginResponse.refresh_token).toBeDefined();

      // Use refresh token to get new access token
      const refreshResponse = await refreshToken(loginResponse.refresh_token);
      expect(refreshResponse.access_token).toBeDefined();
      expect(refreshResponse.refresh_token).toBeDefined();
      expect(refreshResponse.user).toEqual(loginResponse.user);

      // Verify new access token works
      const profileResponse = await getProfile(refreshResponse.access_token);
      expect(profileResponse.email).toBe(currentUserEmail);
    });

    it('should fail with invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid.refresh.token';

      await expect(refreshToken(invalidRefreshToken)).rejects.toThrow();
    });

    it('should fail with expired/non-existent refresh token', async () => {
      // Login to get tokens
      const loginResponse = await loginUser(currentUserEmail, testUser.password);

      // Logout to invalidate refresh token
      await logoutUser(loginResponse.access_token);

      // Try to use invalidated refresh token
      await expect(refreshToken(loginResponse.refresh_token)).rejects.toThrow();
    });
  });

  describe('POST /auth/logout', () => {
    it('should successfully logout and invalidate refresh token', async () => {
      // Login to get tokens
      const loginResponse = await loginUser(currentUserEmail, testUser.password);

      // Logout
      await logoutUser(loginResponse.access_token);

      // Try to use refresh token after logout - should fail
      await expect(refreshToken(loginResponse.refresh_token)).rejects.toThrow();
    });
  });
});
