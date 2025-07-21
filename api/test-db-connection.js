import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://admin:1234@localhost:5432/lrms_db'
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test creating a simple table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      )
    `);
    console.log('✅ Table creation successful!');
    
    // Clean up
    await client.query('DROP TABLE IF EXISTS test_table');
    console.log('✅ Table cleanup successful!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
