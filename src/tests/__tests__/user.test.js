let user;

beforeAll(() => {
  // Setup that runs once before all tests
  user = { name: 'John Doe', age: 30 };
});

afterAll(() => {
  // Cleanup that runs once after all tests
  user = null;
});

beforeEach(() => {
  // Setup that runs before each test
  user.loggedIn = false;
});

afterEach(() => {
  // Cleanup that runs after each test
  user.loggedIn = false;
});

test('logs in user', () => {
  user.loggedIn = true;
  expect(user.loggedIn).toBe(true);
});

test('logs out user', () => {
  expect(user.loggedIn).toBe(false);
});
