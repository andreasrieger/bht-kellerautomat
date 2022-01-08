/**
 * Programming a stack machine
 *
 * @author Andreas Rieger, s82456@bht-berlin.de
 * Date: 2022-01-07
 */

const
    Z = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    O = ['+', '-', '*', '/']
    ;

const eL = 5; // expression length


/**
 * Helper method to return the smallest value of an array
 *
 * @param {*} array
 * @returns the smallest value of an array
 */
Array.min = (array) => {
    return Math.min.apply(Math, array);
};


/**
 * Helper method to return the largest value of an array
 *
 * @param {*} array
 * @returns the largest value of an array
 */
Array.max = (array) => {
    return Math.max.apply(Math, array);
};


/**
 * This method is returning a random digit from $Z
 *
 * @returns a random digit from $Z array
 */
const randomZ = () => {
    const min = Math.ceil(Array.min(Z));
    const max = Math.floor(Array.max(Z));
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 * This method is returning a random operator from $O
 *
 * @returns a random operator from $O array
 */
const randomO = () => {
    const min = 0;
    const max = O.length - 1;
    return O[Math.floor(Math.random() * (max - min + 1)) + min];
};


/**
 * Randomly chosing a production rule
 * 
 * @param {*} expression 
 * @returns left (D) or right (C) expression
 */
const randomCD = (expression) => {
    return (Math.random() < 0.5) ? C(expression) : D(expression);
};


/**
 * Returning an expression consisting of a single digit or
 * a combination of operands and operators
 *
 * @param {*} expression
 * @returns the arithmetical expression with the defined length
 */
const A = () => {
    let expression = randomZ().toString();
    for (let i = 1; i < eL; i++) {
        expression = (i < 2 || i == eL) ? randomCD(expression) : randomCD(B(expression));
    }
    console.log(`Original: ${expression}`)
    return expression
};


/**
 * Returning a given expression in round brackets / parantheses
 *
 * @param {*} expression
 * @returns a given expression in round brackets / parantheses
 */
const B = (expression) => {
    return `(${expression})`;
};


/**
 * Returning a given expression expanded by an additional
 * operator and operand on the right side
 *
 * @param {*} expression
 * @returns a new expression
 */
const C = (expression) => {
    return expression + randomO() + randomZ();
};


/**
 * Returning a given expression expanded by an additional
 * operator and operand on the left side
 * @param {*} expression
 * @returns a new expression
 */
const D = (expression) => {
    return randomZ() + randomO() + expression;
};


/**
 * Removing a randomly selected element from the expression
 * 
 * @param {*} expression 
 * @returns a potentially invalid expression
 */
const makeInvalid = (expression) => {
    const min = 0;
    const max = expression.length - 1;
    const e2R = Math.floor(Math.random() * (max - min + 1)) + min;
    return expression.slice(0, e2R) + expression.slice(e2R + 1);
};


/**
 * Method checking if a given value is a digit in Z array 
 * 
 * @param {*} value 
 * @returns true if value is an element of Z, otherwise false
 */
const isDigit = (value) => {
    for (let i = 0, l = Z.length; i < l; i++) {
        if (value == Z[i]) return true
    }
    return false
};


/**
 * Method checking if a given value is an operator in O array 
 * 
 * @param {*} value 
 * @returns true if value is an element of O, otherwise false
 */
const isOperator = (value) => {
    for (let i = 0, l = O.length; i < l; i++) {
        if (value == O[i]) return true
    }
    return false
};

/**
 * Checking an expressions' validity:
 * 1. Starting or ending with a digit
 * 2. Checking the correct number of parentheses
 * 
 * @param {*} expression 
 * @returns true if expression is valid, otherwise false
 */
const isValidExpression = (expression) => {
    console.log(`test parantheses: ${expression}`)
    
    // check if expression is starting or ending with a digit
    if (!isDigit(stack[0]) && !isDigit(stack[sL - 1])) {
        return false
    }
    
    // iterating through the expression
    const stack = [];
    for (let i = 0, l = expression.length; i < l; i++) {

        // putting opening bracket onto the stack
        if (expression[i] == '(') {
            stack.push(expression[i])
        }

        // empty stack including previous opening bracket
        if (expression[i] == ')') {
            if (stack.length > 0) stack.pop()
            else return false
        }
    }

    // check if stack is emty
    return (stack.length != 0) ? false : true
};


/**
 * Generating a valid expression (true) or otherwise potentially invalid
 * 
 * @param {*} bool 
 */
const E = (bool) => {
    const expression = (bool) ? A() : makeInvalid(A());
    console.log("valid expression? " + isValidExpression(expression))
};


E(true);