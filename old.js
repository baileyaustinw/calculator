const calcButtons = document.querySelector("#calcButtons");
const calcInput = document.querySelector("#calcInput > p");
calcInput.textContent = '0';

const operators = ['x', '-', '+', '÷'];
const actions = ['C', 'A/C', '+/-', '.'];
let initial = 1;
let operand = false;
let lastResult = 0;

const addToInput = function(input) {
    // store the current input in a variable to use later
    let currentInput = calcInput.textContent;
    // store the last character of the current input in a variable for comparisons later
    let lastChar = currentInput.slice(currentInput.length - 1, currentInput.length);

    // user shouldn't be able to add more than one operator
    // check if the last character inputted is an operand and the current input already contains an operand
    // if the last character is an operand and the input already contains an operand but the new user input isn't an operand,
    // append the new input to the current input
    if (operators.includes(lastChar) && currentInput.split('').some((item) => operators.includes(item)) 
        && !actions.includes(input.textContent)) {
        if (!Number.isNaN(parseFloat(input.textContent))) {
            // if it's the first time adding input, remove the default '0'
            if (initial) {
                initial = 0;
                calcInput.textContent = '';
            }
            calcInput.textContent += input.textContent;
        } 
        // set the global variable operand to true to indicate that the input string already contains an operand
        // and exit the function
        operand = true;
        return;
    // otherwise, go through the cases of what the user input could be if not a number or operand
    } else {
        switch (input.textContent) {
            // determine the result of the equation
            case '=':
                let equation = currentInput.split("");
                console.log(`last result: ${lastResult}`);
                return calcInput.textContent = operate(lastResult, equation);
            // change number to be positive or negative depending on the number's current state
            case '+/-':
                if (Number.isNaN(parseFloat(input.textContent))) {
                    if (calcInput.textContent.includes('-')) {
                        calcInput.textContent = calcInput.textContent.replace('-', '');
                    } else {
                        let oldInput = calcInput.textContent;
                        calcInput.textContent = "-" + oldInput;
                    }
                } else {
                    initial = 1;
                    calcInput.textContent = '0';
                }
                break;
            // clear the input and revert back to initial state
            case 'A/C':
                lastResult = 0;
                initial = 1;
                operand = false;
                return calcInput.textContent = 0;
            // remove the last inputted character 
            case 'C':
                if (calcInput.textContent.length > 1) {
                    return calcInput.textContent = calcInput.textContent.substring(0, calcInput.textContent.length - 1);
                } else {
                    initial = 1;
                    return calcInput.textContent = 0;
                }
            default:
                let operator = findOperatorPosition(currentInput);
                let currentInputArr = currentInput.split('');

                if (operand && operators.some((item) => input.textContent.split('').includes(item))) {
                    console.log(checkIfDecimalExists(currentInput));
                    return;
                } else {
                    // if it's the first time adding input, remove the default '0'
                    if (initial && operators.some((item) => input.textContent.split('').includes(item))) {
                        return;
                    } else {
                        initial = 0;
                        calcInput.textContent = '';
                        return calcInput.textContent += input.textContent;
                    }
                }
        }
    }
};

const operate = function(previousResult, expression) {
    let firstNum, lastNum;
    let operator = findOperatorPosition(expression);

    if (!operator.operatorPosition) {
        return 0;
    }
    
    firstNum = parseFloat(expression.slice(0, operator.operatorPosition).join(''));
    lastNum = parseFloat(expression.slice(operator.operatorPosition + 1).join(''));

    switch (operator.operator) {
        case '+':
            lastResult = firstNum + lastNum;
            operand = false;
            return parseFloat(lastResult.toFixed(5));
        case '-':
            lastResult = firstNum - lastNum;
            operand = false;
            return parseFloat(lastResult.toFixed(5));
        case '÷':
            lastResult = firstNum / lastNum;
            operand = false;
            return parseFloat(lastResult.toFixed(5));
        case 'x':
            lastResult = firstNum * lastNum;
            operand = false;
            return parseFloat(lastResult.toFixed(5));
    }
}; 

const checkIfDecimalExists = function(numberString) {
    return numberString.split('').includes('.');
};

const findOperatorPosition = function(expression) {
    let operator;
    let operatorPosition;

    for (let i = 0; i < expression.length; i++) {
        if (operators.includes(expression[i].toString())) {
            operator = expression[i];
            operatorPosition = i;
            return {
                'operator': operator,
                'operatorPosition': operatorPosition
            };
        } 
    }
};

const buttons = calcButtons.querySelectorAll('div');
buttons.forEach(element => {
    element.addEventListener('click', function() {
        addToInput(element);
    });
});