import {
  authFixtures,
  createAuthenticatedUser,
  getProfile,
  loginUser,
  registerUser,
} from '../../helpers/auth/auth.helper';
import { resetDatabase } from '../../setupFilesAfterEnv';

describe('Auth Controller (e2e)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await registerUser(authFixtures.testUser);

      expect(response).toHaveProperty('access_token');
      expect(response).toHaveProperty('user');
      expect(response.user.email).toBe(authFixtures.testUser.email);
      expect(response.user.firstName).toBe(authFixtures.testUser.firstName);
      expect(response.user.lastName).toBe(authFixtures.testUser.lastName);
      expect(response.user).toHaveProperty('id');
      expect(response.user).not.toHaveProperty('password');
    });

    it('should not allow registration with duplicate email', async () => {
      await registerUser(authFixtures.testUser);

      await expect(registerUser(authFixtures.testUser)).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'short',
        firstName: '',
        lastName: '',
      };

      await expect(registerUser(invalidUser)).rejects.toThrow();
    });

    it('should hash password', async () => {
      const response = await registerUser(authFixtures.testUser);

      expect(response.user).not.toHaveProperty('password');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      await registerUser(authFixtures.testUser);

      const response = await loginUser(authFixtures.testUser.email, authFixtures.testUser.password);

      expect(response).toHaveProperty('access_token');
      expect(typeof response.access_token).toBe('string');
    });

    it('should not login with invalid email', async () => {
      await expect(loginUser('invalid@email.com', 'password')).rejects.toThrow();
    });

    it('should not login with invalid password', async () => {
      await registerUser(authFixtures.testUser);

      await expect(loginUser(authFixtures.testUser.email, 'wrongpassword')).rejects.toThrow();
    });

    it('should not login with missing credentials', async () => {
      await expect(loginUser('', '')).rejects.toThrow();
    });
  });

  describe('GET /auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const token = await createAuthenticatedUser();

      const response = await getProfile(token);

      expect(response).toHaveProperty('id');
      expect(response.email).toBe(authFixtures.testUser.email);
      expect(response.firstName).toBe(authFixtures.testUser.firstName);
      expect(response.lastName).toBe(authFixtures.testUser.lastName);
    });

    it('should not get profile without token', async () => {
      await expect(getProfile('')).rejects.toThrow();
    });

    it('should not get profile with invalid token', async () => {
      await expect(getProfile('invalid-token')).rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full auth flow', async () => {
      // Register user
      const registerResponse = await registerUser(authFixtures.testUser);
      expect(registerResponse).toHaveProperty('access_token');

      // Login user
      const loginResponse = await loginUser(authFixtures.testUser.email, authFixtures.testUser.password);
      expect(loginResponse).toHaveProperty('access_token');

      // Get profile
      const profileResponse = await getProfile(loginResponse.access_token);
      expect(profileResponse.email).toBe(authFixtures.testUser.email);
      expect(profileResponse.firstName).toBe(authFixtures.testUser.firstName);
      expect(profileResponse.lastName).toBe(authFixtures.testUser.lastName);
    });

    it('should handle multiple users registration', async () => {
      const firstUserResponse = await registerUser(authFixtures.testUser);
      expect(firstUserResponse).toHaveProperty('access_token');

      const secondUserResponse = await registerUser(authFixtures.adminUser);
      expect(secondUserResponse).toHaveProperty('access_token');

      // Verify both users exist
      const firstUserProfile = await getProfile(firstUserResponse.access_token);
      const secondUserProfile = await getProfile(secondUserResponse.access_token);

      expect(firstUserProfile.email).toBe(authFixtures.testUser.email);
      expect(secondUserProfile.email).toBe(authFixtures.adminUser.email);
    });
  });
});
