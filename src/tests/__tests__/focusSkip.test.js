test.only('only this test will run', () => {
    expect(true).toBe(true);
});
  
test.skip('this test will be skipped', () => {
    expect(true).toBe(true);
});
  