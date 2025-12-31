import { db, users, stockLocations } from './db/index.js';

async function seed() {
  console.log('Seeding database...');

  // Create default users
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    await db.insert(users).values([
      { email: 'admin@hotel.com', name: 'Admin User', role: 'admin' },
      { email: 'store@hotel.com', name: 'Store Keeper', role: 'storekeeper' },
      { email: 'maintenance@hotel.com', name: 'Maintenance Staff', role: 'maintenance' },
    ]);
    console.log('Created default users');
  } else {
    console.log('Users already exist, skipping...');
  }

  // Create default locations
  const existingLocations = await db.select().from(stockLocations);
  if (existingLocations.length === 0) {
    await db.insert(stockLocations).values([
      { name: 'Main Store', description: 'Central storage facility' },
      { name: 'Housekeeping', description: 'Housekeeping supplies storage' },
      { name: 'Bar', description: 'Bar inventory storage' },
      { name: 'Kitchen', description: 'Kitchen and F&B storage' },
    ]);
    console.log('Created default locations');
  } else {
    console.log('Locations already exist, skipping...');
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
