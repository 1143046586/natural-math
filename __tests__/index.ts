import { BigNumber, math } from '../src';

describe('test calculate reverse polish notation', function () {
  it('test rpnCalculate', function () {
    expect(math('10+20')).toBe('30');
    expect(math('1+2+3')).toBe('6');
    expect(math('1+2*3')).toBe('7');
    expect(math('(1+2)*3')).toBe('9');
    expect(math('(1+2)*3!')).toBe('18');
    expect(math('1+√4*3!')).toBe('13');
    expect(math('1+√4!*3!')).toBe('13');
    expect(math('(1+2)*(3+4)')).toBe('21');
    expect(math('√√81')).toBe('3');
    expect(math('√√81!')).toBe('6');
    expect(math('√√81!!')).toBe('720');
    expect(math('100%9')).toBe('1');
    // expect(math('100@9')).toBe(1);
    expect(math('5-1')).toBe('4');
    expect(math('5+ -2')).toBe('3');
    expect(math('5--2')).toBe('7');
    expect(math('123456789012345678+12345678')).toBe('123456789024691356');
  });
  it('test rpnCalculate', function () {
    expect(math(`123+${new BigNumber('1234567890123456789012345678901234567890')}`)).toBe('1234567890123456789012345678901234568013');
    expect(math(`123+${new BigNumber(123)}`)).toBe('246');
    expect(math(`123+${1234567890123456789n}`)).toBe('1234567890123456912');
    expect(math(`12345678901234567890.1234567890+12345678901234567890.1234567890`)).toBe('24691357802469135780.246913578');
    expect(new BigNumber(-0).toFixed() === '0').toBe(true);
    expect(new BigNumber(0).toFixed() === '0').toBe(true);
  });
});
