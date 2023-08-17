import { PrismaClient } from '@prisma/client';

const prismaInit = async () => {
    const prisma = new PrismaClient();
    await prisma.init.deleteMany();
    try {
        await prisma.init.create();
        const read = await prisma.init.findFirst({
            where: {
                name: 'prisma',
            },
        });
        return read;
    } catch (err) {
        console.error(err);
    }
};

export default prismaInit;
