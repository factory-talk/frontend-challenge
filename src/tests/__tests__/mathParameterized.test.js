test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('adds %i + %i to equal %i', (a, b, expected) => {
    expect(a + b).toBe(expected);
  });
  