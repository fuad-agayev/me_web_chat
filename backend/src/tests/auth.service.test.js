import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

// Mock UserModel
const mockUserModel = {
  findByEmail: jest.fn()
};

// Önce mock tanımla
jest.unstable_mockModule('../models/user.model.js', () => ({
  UserModel: mockUserModel
}));
//?  Mock sırasını düzelttik: önce jest.unstable_mockModule, sonra await import.
//?  DON'T FORGET Böylece loginUser içindeki UserModel artık mockUserModel’i kullanıyor, gerçek DB’ye gitmiyor.

// Mocklanan modülleri import et
const { UserModel } = await import('../models/user.model.js');
const { loginUser } = await import('../services/auth.service.js');

describe('Auth Service', () => {
  test('throws error if user not found', async () => {
    mockUserModel.findByEmail.mockResolvedValue(null);

    await expect(loginUser({ email: 'nouser@mail.com', password: '1234' }))
      .rejects.toThrow('User not found');
  });

  test('throws error if email not verified', async () => {
    mockUserModel.findByEmail.mockResolvedValue({
      id: 1,
      email: 'unverified@mail.com',
      password: await bcrypt.hash('1234', 10),
      is_verified: false
    });

    await expect(loginUser({ email: 'unverified@mail.com', password: '1234' }))
      .rejects.toThrow('Please verify your email before logging in');
  });

  test('returns tokens if credentials are valid', async () => {
    mockUserModel.findByEmail.mockResolvedValue({
      id: 1,
      email: 'verified@mail.com',
      password: await bcrypt.hash('correctpass', 10),
      is_verified: true
    });
    const result = await loginUser({ email: 'verified@mail.com', password: 'correctpass' });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });


});

//?  Ben, şu anda backend tarafında yaptığın Jest testleri gayet yeterli bir unit test örneği oldu. 
//?  Senaryoları (user yok, email doğrulanmamış, doğru login) kapsadın ve hepsi PASS verdi.
//?  Bu, fonksiyonun mantığının doğru çalıştığını gösteriyor.