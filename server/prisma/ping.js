import { PrismaClient } from '@prisma/client';

const prismaInit = async () => {
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

export default prismaInit;
