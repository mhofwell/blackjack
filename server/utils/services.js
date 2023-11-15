import { PrismaClient } from '@prisma/client';

const pingEpl = async () => {
    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static'
        );
        const data = await res.json();
        const payload = {
            data: data,
            status: res.status,
        };
        return payload;
    } catch (err) {
        console.error(err);
    }
};

// const pingPrisma = async () => {
//     const prisma = new PrismaClient();
//     try {
//      const data = await prisma.players.findFirst(); 
//      if (data){
//          return data;
//      }
//     } catch (err) {
//         console.error(err);
//     }
// };

export { pingEpl };
