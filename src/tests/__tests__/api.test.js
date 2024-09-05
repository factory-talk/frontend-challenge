const fetchData = jest.fn();

fetchData.mockResolvedValue('data');

test('fetches data', async () => {
  const data = await fetchData();
  expect(data).toBe('data');
});
