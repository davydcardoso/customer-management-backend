export type AuthTokenPayload = {
  sub: string;
  username: string;
  type: 'access' | 'refresh';
};
