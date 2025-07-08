import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { useAuth } from 'context';
import { authStorage } from 'lib/auth-utils';

export function TokenDebugPanel() {
  const { refreshToken, user, isAuthenticated } = useAuth();

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const handleClearTokens = () => {
    authStorage.clearAll();
    globalThis.location.reload();
  };

  const getTokenInfo = () => {
    const token = authStorage.getToken();
    const refreshToken = authStorage.getRefreshToken();

    if (!token) return { accessToken: 'None', refreshToken: 'None' };

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const exp = new Date(decoded.exp * 1000);
      const now = new Date();
      const timeLeft = exp.getTime() - now.getTime();

      return {
        accessToken: `Expires: ${exp.toLocaleString()} (${Math.floor(timeLeft / 1000 / 60)} minutes left)`,
        refreshToken: refreshToken ? 'Present' : 'None',
      };
    } catch {
      return { accessToken: 'Invalid', refreshToken: refreshToken ? 'Present' : 'None' };
    }
  };

  const tokenInfo = getTokenInfo();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Token Debug Panel</CardTitle>
        <CardDescription>Debug authentication tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>User:</strong> {user?.email}
        </div>
        <div>
          <strong>Access Token:</strong> {tokenInfo.accessToken}
        </div>
        <div>
          <strong>Refresh Token:</strong> {tokenInfo.refreshToken}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshToken} variant="outline">
            Refresh Token
          </Button>
          <Button onClick={handleClearTokens} variant="destructive">
            Clear Tokens
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
