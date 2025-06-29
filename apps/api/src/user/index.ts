// Export the service
export { UserService } from './user.service';

// Export the controller
export { UserController } from './user.controller';

// Export the module
export { UserModule } from './user.module';

// Export return types inferred from the actual service
export type {
  GetUserReturn,
  CreateUserReturn,
  UpdateUserReturn,
  DeleteUserReturn,
  GetAllUsersReturn,
  UserServiceReturnTypes
} from './user.types';
