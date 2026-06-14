import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const services = await prisma.service.findMany({
        where: { 
            is_active: true,
            vendor: {
                approval_status: 'APPROVED'
            }
        },
        include: {
            vendor: {
                include: {
                    user: { select: { name: true } },
                    reviews_received: { select: { rating: true } }
                }
            },
            category: true,
        },
    });

    console.log(JSON.stringify(services.map(service => ({
        serviceId: service.id,
        vendorId: service.vendor.id,
        reviews: service.vendor.reviews_received
    })), null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
