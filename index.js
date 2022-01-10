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
    // console.log(`Original: ${expression}`)
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
 * 
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
 * Helper method to return a string if stack is empty
 * 
 * @param {*} stack 
 * @returns last stack element if stack length ist greater than 0(zero), 
 * otherwise an empty string
 */
const stackTop = stack => {
    return (stack.length > 0) ? stack[stack.length - 1] : '';
};


/**
 * Method to store state, head, top (of stack) and stack as object
 * 
 * @param {*} state 
 * @param {*} head 
 * @param {*} top 
 * @param {*} stack
 * @param {*} valid
 * @returns object with elements
 */
const stateObject = (state, head, top, stack, valid) => {
    stack = stack.join('').toString();
    return {
        state: state,
        head: head,
        top: top,
        stack: stack,
        valid: valid
    };
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
    console.log(`to test: ${expression}`)


    const states = []; // state storage

    // check if expression is starting or ending with a digit
    // if (!isDigit(expression[0]) && !isDigit(expression[expression.length - 1])) {
    //     return false
    // }

    // iterating through the expression
    const stack = ['$'];
    states.push(stateObject(0, "eps", stackTop(stack), stack))
    stack.pop()

    for (let i = 0, l = expression.length; i < l; i++) {


        // putting opening bracket onto the stack
        if (expression[i] == '(') {
            stack.push(expression[i])
            states.push(stateObject(0, expression[i], stackTop(stack), stack))
        }

        // empty stack including previous opening bracket
        if (expression[i] == ')') {
            if (stack.length > 0) {
                states.push(stateObject(1, expression[i], stackTop(stack), stack))
                stack.pop()
            }
            else {
                states.push(stateObject(2, expression[i], stackTop(stack), stack, false))
                return states
            }
        }
    }

    // check if stack is emty
    if (stack.length != 0) {
        states.push(stateObject(2, "eps", stackTop(stack), stack, false))
        return states
    } else {
        states.push(stateObject(2, 0, stackTop(stack), stack, true))
        return states
    }
};




/**
 * Generating a valid expression (true) or otherwise potentially invalid
 * 
 * @param {*} bool 
 * @returns an object with the generated expression and the stored states
 */
const E = (bool) => {
    const expression = (bool) ? A() : makeInvalid(A());
    const states = isValidExpression(expression)
    return {
        expression: expression,
        states: states
    }
};


/**
 * Validating a user generated expression
 * 
 * @param {*} userinput 
 * @returns an object with the user generated expression and the stored states
 */
function main(userinput) {
    const expression = userinput;
    const states = isValidExpression(expression);
    return {
        expression: expression,
        states: states
    }
}