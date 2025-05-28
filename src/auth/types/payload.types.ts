export interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  ext: number;
}
