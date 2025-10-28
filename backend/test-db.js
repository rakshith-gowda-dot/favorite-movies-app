import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test if we can query the Entry table
    const entries = await prisma.entry.findMany();
    console.log(`✅ Found ${entries.length} entries in database`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();