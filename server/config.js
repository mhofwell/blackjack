// let PORT,
//     REDIS_HOST,
//     REDIS_PORT,
//     CLIENT_PORT,
//     REDIS_USER,
//     REDIS_PASSWORD,
//     API_PRIVATE_URL

// if (process.env.NODE_ENV === 'development') {
//     REDIS_HOST = process.env.REDIS_HOST;
//     REDIS_PORT = process.env.REDIS_PORT;
//     REDIS_USER = process.env.REDIS_USER;
//     REDIS_PASSWORD = process.env.REDIS_PASSWORD;
//     CLIENT_PORT = process.env.CLIENT_PORT;
//     PORT = process.env.PORT;
//     API_PRIVATE_URL = process.env.API_PRIVATE_URL

// } else if (process.env.NODE_ENV === 'production') {
//     REDIS_HOST = process.env.REDIS_HOST;
//     REDIS_PORT = process.env.REDIS_PORT;
//     REDIS_USER = process.env.REDIS_USER;
//     REDIS_PASSWORD = process.env.REDIS_PASSWORD;
//     CLIENT_PORT = process.env.CLIENT_PORT;
//     PORT = process.env.PORT;

// }

// export {
//     PORT,
//     REDIS_HOST,
//     REDIS_PORT,
//     CLIENT_PORT,
//     REDIS_USER,
//     REDIS_PASSWORD,
//     API_PRIVATE_URL

// };

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USER = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const CLIENT_PORT = process.env.CLIENT_PORT;
const PORT = process.env.PORT;
const API_PRIVATE_URL = process.env.API_PRIVATE_URL;

export {
    PORT,
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_PRIVATE_URL,
};
