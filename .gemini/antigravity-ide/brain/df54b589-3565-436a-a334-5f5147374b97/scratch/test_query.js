import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function test() {
  try {
    const list = await pb.collection('products').getList(1, 10);
    console.log('Seeded products:', list.items.length);
  } catch (err) {
    console.error('Fetch failed:', err.message, JSON.stringify(err.data));
  }
}

test();
