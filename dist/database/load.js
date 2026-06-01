import Migration from '@/database/migration.js';
import Seed from '@/database/seeders.js';
async function load() {
    await Migration.up();
    await Seed.up();
}
load().catch(console.error);
//# sourceMappingURL=load.js.map