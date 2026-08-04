import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function inspect() {
  try {
    await pb.collection('_superusers').authWithPassword('admin@zare.com', 'Admin@123');
    console.log('Logged in successfully!');
    
    const collections = await pb.collections.getFullList();
    console.log('Collections list:');
    for (const c of collections) {
      console.log(`- ${c.name} (${c.id}), type: ${c.type}`);
    }
  } catch (err) {
    console.error('Inspection failed:', err.message, JSON.stringify(err.data));
  }
}

inspect();
