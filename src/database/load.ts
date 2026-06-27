import Seed from '@/database/seeders.js';

async function load(): Promise<void> {

  await Seed.up();
}

load().catch(console.error);