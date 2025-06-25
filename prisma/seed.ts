// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { name: 'LANDLORD' },
            { name: 'RENTER' },
        ],
        skipDuplicates: true,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });