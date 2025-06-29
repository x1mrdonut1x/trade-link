// Export return types inferred from the actual UserService implementation
import type { UserService } from './user.service';

// ✅ CORRECT: Infer return types directly from the actual service class
export type GetUserReturn = Awaited<ReturnType<UserService['getUser']>>;
export type CreateUserReturn = Awaited<ReturnType<UserService['createUser']>>;
export type UpdateUserReturn = Awaited<ReturnType<UserService['updateUser']>>;
export type DeleteUserReturn = Awaited<ReturnType<UserService['deleteUser']>>;
export type GetAllUsersReturn = Awaited<ReturnType<UserService['getAllUsers']>>;

// Extract all service method return types at once
export type UserServiceReturnTypes = {
  [K in keyof UserService]: UserService[K] extends (...args: unknown[]) => unknown 
    ? Awaited<ReturnType<UserService[K]>>
    : never;
};
