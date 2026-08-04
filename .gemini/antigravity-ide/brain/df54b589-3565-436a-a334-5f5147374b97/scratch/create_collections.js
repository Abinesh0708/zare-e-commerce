import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function run() {
  try {
    console.log('Authenticating as superuser...');
    // In newer PB versions, we use authWithPassword on the collection "_superusers"
    // or pb.admins.authWithPassword for older versions. Let's try to authenticate using the appropriate method.
    // For PB v0.39.0+, superusers are just records in the '_superusers' collection.
    // Let's first try to auth with the new v0.39.0+ method:
    try {
      await pb.collection('_superusers').authWithPassword('admin@zare.com', 'Admin@123');
      console.log('Authenticated via _superusers collection.');
    } catch (e) {
      console.log('Failed to authenticate via _superusers, trying pb.admins.authWithPassword...');
      // Fallback to pb.admins for older pocketbase versions
      await pb.admins.authWithPassword('admin@zare.com', 'Admin@123');
      console.log('Authenticated as admin.');
    }

    console.log('Creating/Updating collections...');

    const productsCollection = {
      name: 'products',
      type: 'base',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'originalPrice', type: 'number' },
        { name: 'category', type: 'text', required: true },
        { name: 'image', type: 'text' },
        { name: 'images', type: 'json' },
        { name: 'description', type: 'text' },
        { name: 'rating', type: 'number' },
        { name: 'reviews', type: 'number' },
        { name: 'stockStatus', type: 'text' },
        { name: 'specs', type: 'json' },
        { name: 'isFeatured', type: 'bool' }
      ],
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    };

    const mediaCollection = {
      name: 'media',
      type: 'base',
      schema: [
        { name: 'file', type: 'file', required: true, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/*'] } },
        { name: 'name', type: 'text' }
      ],
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    };

    // Create or update products collection
    try {
      await pb.collections.create(productsCollection);
      console.log('✓ Created "products" collection.');
    } catch (err) {
      if (err.status === 400 && err.data?.data?.name?.code === 'validation_invalid_name') {
        console.log('"products" collection name validation failed, checking if already exists.');
      } else {
        try {
          const existing = await pb.collections.getOne('products');
          // Update it
          await pb.collections.update(existing.id, productsCollection);
          console.log('✓ Updated "products" collection.');
        } catch (updateErr) {
          console.error('Error with products collection:', err.message, updateErr.message);
        }
      }
    }

    // Create or update media collection
    try {
      await pb.collections.create(mediaCollection);
      console.log('✓ Created "media" collection.');
    } catch (err) {
      try {
        const existing = await pb.collections.getOne('media');
        // Update it
        await pb.collections.update(existing.id, mediaCollection);
        console.log('✓ Updated "media" collection.');
      } catch (updateErr) {
        console.error('Error with media collection:', err.message, updateErr.message);
      }
    }

    console.log('PocketBase Schema Setup Complete!');
  } catch (error) {
    console.error('Execution failed:', error);
  }
}

run();
