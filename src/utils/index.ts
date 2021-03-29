import BigNumber from 'bignumber.js';

export const rpn = {
  _precedence: { '√': 3, '!': 3, '^': 3, '%': 2, '/': 2, '*': 2, '-': 1, '+': 1, '#': 0 } as { [key: string]: number },

  /**
   * operations
   * @private
   */
  _operation: {
    '+': (a: string, b: string) => new BigNumber(a).plus(b).toFixed(),
    '-': (a: string, b: string) => new BigNumber(a).minus(b).toFixed(),
    '*': (a: string, b: string) => new BigNumber(a).multipliedBy(b).toFixed(),
    '/': (a: string, b: string) => new BigNumber(a).dividedBy(b).toFixed(),
    '^': (a: string, b: string) => new BigNumber(a).pow(b).toFixed(),
    '!': function (n: string) {
      for (var i = 1, r = new BigNumber(1); new BigNumber(i).lte(n); i++) {
        r = new BigNumber(r).multipliedBy(i);
      }
      return new BigNumber(n).lt(0) ? NaN : r.toFixed();
    },
    '%': (a: string, b: string) => new BigNumber(a).modulo(b).toFixed(),
    '√': (n: string) => new BigNumber(n).sqrt().toFixed(),
  } as {
    [key: string]: any;
  },

  /**
   * split expression to array
   * @private
   * @param exp - infix expression
   * @returns {Array|null}
   */
  _splitExp: function (exp: string) {
    exp = exp
      .replace(/[a-zA-Z]/g, '')
      .replace(/([\d!])\-(\d)/g, '$1 - $2')
      .replace(/([%+\-\*\/^])\-(\d)/g, '$1 -$2');

    return /^[+*\/!^%]|\d\(|[\d\)]√[\d\(]|![\d\(]|%%|[+\-*\/^%]{2,}|[+\-*\/√^]$/.test(exp) ? null : exp.match(/(-?(?:\d+\.?\d*|-?\.\d*))|[()+\-*\/√!^%]/gi);
    // return /^[+*\/!^%]|\d\(|[\d\)]√|%[\d\(]|![\d\(]|%%|[+\-*\/^]{2,}|[+\-*\/√^]$/.test(exp) ? null : exp.match(/(-?(?:\d+\.?\d*|-?\.\d*))|[()+\-*\/√!^%]/gi);
  },

  /**
   * check character, is or not a operator
   * @private
   * @param char - character
   * @returns {boolean}
   */
  _isOperator: function (char: string) {
    return /^[√%!^\/\*\-\+#]$/.test(char);
  },

  /**
   * check character, is or not a unary operator
   * @private
   * @param char - character
   * @returns {boolean}
   */
  _isUnaryOperator: function (char: string) {
    return /^[√!]$/.test(char);
  },

  /**
   * check character, is or not a bracket
   * @private
   * @param char - character
   * @returns {boolean}
   */
  _isBrackets: function (char: string) {
    return /^[\(\)]$/.test(char);
  },

  /**
   * check string, is or not a number
   * @private
   * @param str - character
   * @returns {boolean}
   */
  _isNumber: function (str: string) {
    return /^-?\d+\.\d+$|^-?\d+$/.test(str);
  },

  /**
   * transfer infix expression to reverse polish notation
   * @param exp - infix expression
   * @returns {string|null}
   */
  infix2rpn: function (exp: string) {
    let arrExp = rpn._splitExp(exp),
      expStack: string[] = [],
      opStack: string[] = [],
      opItem: string,
      stackItem: string;

    if (!arrExp) {
      return null;
    }
    arrExp = arrExp.concat('#');
    for (var looper = 0; looper < arrExp.length; looper++) {
      opItem = arrExp[looper];

      if (rpn._isNumber(opItem)) {
        expStack.push(opItem);
      } else if (rpn._isOperator(opItem)) {
        while (opStack.length) {
          stackItem = opStack.pop() as string;
          if (
            (opItem === '√' && stackItem === '√' && rpn._precedence[stackItem] > rpn._precedence[opItem]) ||
            ((opItem !== '√' || stackItem !== '√') && rpn._precedence[stackItem] >= rpn._precedence[opItem])
          ) {
            expStack.push(stackItem);
          } else {
            opStack.push(stackItem);
            break;
          }
        }
        opStack.push(opItem);
      } else if (rpn._isBrackets(opItem)) {
        if (opItem === '(') {
          opStack.push(opItem);
        } else {
          while (opStack.length) {
            stackItem = opStack.pop() as string;
            if (stackItem !== '(') {
              expStack.push(stackItem);
            } else {
              break;
            }
          }
        }
      }
    }
    return expStack.length ? expStack.join(' ') : null;
  },

  /**
   * calculate reverse polish notation
   * @param exp - reverse polish notation
   * @returns {number}
   */
  rpnCalculate: function (exp: string) {
    var arrExp = exp.split(' '),
      calcStack: string[] = [],
      opItem: string,
      param1,
      param2;

    for (var looper = 0; looper < arrExp.length; looper++) {
      opItem = arrExp[looper];
      if (rpn._isNumber(opItem)) {
        calcStack.push(opItem);
      } else if (rpn._isOperator(opItem)) {
        if (rpn._isUnaryOperator(opItem)) {
          calcStack.push(rpn._operation[opItem](calcStack.pop()));
        } else {
          param2 = calcStack.pop();
          param1 = calcStack.pop();
          calcStack.push(rpn._operation[opItem](param1, param2));
        }
      }
    }
    // console.log(calcStack.pop());

    return calcStack.pop();
  },

  /**
   * calculate expression
   * @param exp - expression string
   * @returns {number|null}
   */
  calculate: function (exp: string) {
    return rpn.rpnCalculate(rpn.infix2rpn(exp) as string);
  },
};
