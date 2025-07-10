import { db } from './server/db';
import { categories } from './shared/schema';

async function checkCategories() {
  try {
    const cats = await db.select().from(categories);
    console.log('Categories:', cats);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();