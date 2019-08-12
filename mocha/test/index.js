it('Top-level', () => {});

describe('Suite 1', () => {
  //before(() => console.log('Before'));
  //beforeEach(() => console.log('Before Each'));

  it('Test 1', () => {
  });

  it('Test 2', () => {
    throw Error('Should throw');
  });

  it('Test 3', () => {
    console.log('Logging');
  });
});

describe('Suite 2', () => {
  it('Test 1', () => console.log('More logging'));
});

it('More Top-level', () => {});
