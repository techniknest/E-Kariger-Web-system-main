
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const vendors = await prisma.vendorProfile.findMany({
    include: {
      user: { select: { name: true } }
    }
  });

  console.log('Total Vendors:', vendors.length);
  
  for (const v of vendors) {
    const vc = await prisma.booking.count({ where: { vendor_id: v.id, status: 'COMPLETED' } });
    const vb = await prisma.booking.findMany({ where: { vendor_id: v.id, status: 'COMPLETED' } });
    const totalRev = vb.reduce((s, b) => s + Number(b.final_price || b.total_price), 0);
    
    console.log(`Vendor: ${v.user.name} | ID: ${v.id}`);
    console.log(`- Completed Jobs: ${vc}`);
    console.log(`- Total Revenue: ${totalRev}`);
  }
}

checkData().catch(console.error).finally(() => prisma.$disconnect());
