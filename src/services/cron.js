import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    // Mark completed enrollments
    await prisma.enrollment.updateMany({
      where: {
        status: 'ACTIVE',
        course: {
          endDate: { lte: now },
        },
      },
      data: { status: 'COMPLETED' },
    });

    console.log('Updated completed enrollments');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});
