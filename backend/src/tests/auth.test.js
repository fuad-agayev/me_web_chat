
import { loginUser } from '../services/auth.service.js';

describe('Auth Service', () => {

  test('should login user with correct credentials', async () => {
    await expect(loginUser({email: 'myfake2@Mail.com', password: '2233'})).rejects.toThrow('User not found');
  });

  test('should not login user with unverified email', async()=> {
     const data = {
      email: 'myfake@Mail.com',
      password: '22331'
     };
     await expect(loginUser(data)).rejects.toThrow('Please verify your email before logging in');
  })
})