import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function inspect() {
  try {
    await pb.collection('_superusers').authWithPassword('admin@zare.com', 'Admin@123');
    
    const products = await pb.collections.getOne('products');
    console.log('PRODUCTS COLLECTION SCHEMA:');
    console.log(JSON.stringify(products, null, 2));

    const media = await pb.collections.getOne('media');
    console.log('\nMEDIA COLLECTION SCHEMA:');
    console.log(JSON.stringify(media, null, 2));
  } catch (err) {
    console.error('Inspection failed:', err.message, JSON.stringify(err.data));
  }
}

inspect();
