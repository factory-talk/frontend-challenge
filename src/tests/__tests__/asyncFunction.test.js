async function fetchData() {
    return 'some data';
}
  
test('async test', async () => {
    const data = await fetchData();
    expect(data).toBe('some data');

});
  