import PgBoss from 'pg-boss';

async function startWorker() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const boss = new PgBoss(dbUrl);
  boss.on('error', (error) => console.error('[pelita-worker] pg-boss error:', error));

  await boss.start();
  console.log('[pelita-worker] Persistent pg-boss scheduler started successfully.');

  // Worker siap memproses antrean pengingat Schedule (H-1 jam) & Nutrition (19:00)
  await boss.work('reminder-dispatch-queue', async (jobs) => {
    for (const job of jobs) {
      console.log(`[pelita-worker] Processing reminder job ID: ${job.id}`, job.data);
    }
  });
}

startWorker().catch((err) => {
  console.error('[pelita-worker] Failed to start:', err);
  process.exit(1);
});
