export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET_KEY: string;
            DATABASE_URL: string;
            NEXTAUTH_URL: string;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}
