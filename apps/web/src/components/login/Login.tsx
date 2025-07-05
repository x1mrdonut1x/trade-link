import Logo from '../../assets/logo.svg?react';
import { LoginForm } from './LoginForm';

export const Login = () => {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Logo className="size-4 w-full h-full" />
            </div>
            TradeLink CRM
          </a>
          <LoginForm />
        </div>
      </div>
    </>
  );
};
