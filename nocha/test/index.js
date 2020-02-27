it('Scrobble', () => {});

describe('All the things', () => {
  it('Frabjous day', () => {});

  it('Lorum Ipsum', () => {
    throw Error('Should throw');
  });

  it('Dolor wat', () => {
    throw Error('No, really... just throw');
  });

  describe('Some of the things', () => {
    it('Turkey shoot', () => {});
  });

  for (let i = 0; i < 5; i++) {
    it(`Plunko ${i}`, () => {});
  }
});

describe('None of it', () => {
  it('Arcturux', () => {});
});

it('Sloooooooow', () => {
  return new Promise(resolve => setTimeout(resolve, 4000));
});

it('Netherworld', () => {});
