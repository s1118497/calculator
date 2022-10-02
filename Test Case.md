# 測試步驟

## Zero operand:

    1. click operation
        PASS ==>no action (i.e. Not accept first operand as negative value)
    2. click evaluation
        PASS ==>no action
    3. click 0
        PASS ==>currentOperand
    4. click "."
        PASS ==>currentOperand: "0."
            because .format("")=0
    5. click AC / DEL
        PASS ==>no action

## One operand:

    ### currentOperand:
    1. two or more digit input
        PASS ==>currentOperand
    2. fraction
        PASS ==>currendOperand
    3. more than one leading 0
        PASS ==>no action
    4. more than one "."
        PASS ==>no action
    5. enter operation afterward
        PASS ==>currentOperand:null , operation, previousOperand:computation
    6. enter "="
        PASS ==>no action
    7. enter AC/DEL
        PASS

    ### previousOperand, currentOperand=null
        e.g. 12 + 12 *
        PASS ==>currentOperand:null , operation: *, previousOperand:computation

## Two operands:

    1. enter operation
        PASS ==>previousOperand, currenOperand:null
    2. enter "="
        PASS ==>currentOperand
    3. divided by 0
        PASS ==>infinity sign, because .format("Infinity") = "∞"
    4. 0 divide 0
        PASS ==>infinity sign

## Repeat above after computation

    1. overwrite after evaluate
        PASS ==>operation:null, currentOperand

## Bugs:

    bug 1: Sometimes fraction operation precision, JS Engine operation problem?
    bug 2: when "." without trailing digit, previousOperand still display the "."
        e.g. when (12. + ) previousOperand= "12."
    bug 3: not accepting negative first operand
