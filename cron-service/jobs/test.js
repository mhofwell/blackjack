const dotenv = require('dotenv');
dotenv.config();

async function getstuff() {
    const res = await fetch(process.env.EPL_API_FUTURE);

    console.log(res.status);
    console.log(await res.json());
}

getstuff();
