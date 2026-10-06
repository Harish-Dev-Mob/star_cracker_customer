import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const rows = await p.product.findMany({ select: { id: true, name: true, images: true }, take: 5 });
for (const r of rows) {
  console.log('name:', r.name);
  console.log('raw images:', r.images);
  try {
    const parsed = JSON.parse(r.images);
    console.log('parsed:', parsed);
  } catch (e) {
    console.log('parse error:', e.message);
  }
  console.log('---');
}
await p.$disconnect();
