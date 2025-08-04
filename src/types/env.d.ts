declare namespace NodeJS {
  interface ProcessEnv {
    // mongoose
    MONGODB_URL: string | undefined;
    PORT: string | undefined;
    // jwt
    JWT_SECRET: string | undefined;
    JWT_AccessTokenExpiry: string | undefined;
    JWT_RefreshTokenExpiry: string | undefined;
    // encryption
    ENCRYPTION_KEY: string | undefined;
    // bunny
    BUNNY_API_KEY: string | undefined;
    BUNNY_STORAGE_URL: string | undefined;
    BUNNY_CDN_URL: string | undefined;
    // swagger
    SWAGGER_USERNAME: string | undefined;
    SWAGGER_PASSWORD: string | undefined;
  }
}
