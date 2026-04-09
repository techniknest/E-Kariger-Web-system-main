import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.user.updateMany({
    where: { vendor_profile: { isNot: null } },
    data: { role: 'VENDOR' },
  });
  console.log('Fixed users:', result.count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
