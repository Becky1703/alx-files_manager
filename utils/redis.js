import { createClient } from 'redis';
import { promisify } from 'util';

// class constructor to create Redis client
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  // Function to check whether connection to Redis is successful
  isAlive() {
    return this.isClientConnected;
  }

  // Asynchronous function to get the value stored in a key
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // Asynchronous function to set a duration and expiration
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  // Asynchronous function that deletes a value stored to a key
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

// Exports the redisClient class
export const redisClient = new RedisClient();
export default redisClient;
