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

const pingPrisma = async () => {
    const prisma = new PrismaClient();
    await prisma.init.deleteMany();
    try {
        await prisma.init.create({
            data: {},
        });
        const data = await prisma.init.findFirst({
            where: {
                name: 'prisma',
            },
        });
        return data;
    } catch (err) {
        console.error(err);
    }
};

export { pingPrisma, pingEpl };
