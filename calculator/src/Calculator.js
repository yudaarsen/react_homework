import { useEffect, useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation'
};

const OPERATIONS = {
    CLEAR: 'AC',
    SUM: '+',
    DIFF: '-',
    MUL: '*',
    DIV: '/',
    CHS: '+/-',
    EVAL: '='
};

let operands = [];
let lastOp;

function evaluate(a, b, op) {
    switch(op) {
        case OPERATIONS.SUM:
            return parseFloat(a) + parseFloat(b);
        case OPERATIONS.DIFF:
            return parseFloat(a) - parseFloat(b);
        case OPERATIONS.MUL:
            return parseFloat(a) * parseFloat(b);
        case OPERATIONS.DIV:
            return parseFloat(a) / parseFloat(b);
        
    }
}

function reducer(state, {type, payload}) {
    switch(type) {
        case ACTIONS.ADD_DIGIT: {
            if(state.operand === "0" && payload.digit === "0") return state;
            if(payload.digit === "." && state.operand.includes(".")) return state;
            if(state.operand === "0" && payload.digit !== ".") state.operand = "";
            if(state.clear == true) state.operand = "";
            if(state.ev == true) {
                operands = []
            }
            return {
                operand: `${state.operand || ""}${payload.digit}`
            };
        }
        case ACTIONS.CHOOSE_OPERATION: {
            switch(payload.opcode) {
                case OPERATIONS.CLEAR: {
                    operands = [];
                    return { 
                        operand: "0" 
                    };
                }
                case OPERATIONS.SUM: case OPERATIONS.DIFF: case OPERATIONS.DIV: case OPERATIONS.MUL: {
                    if(operands.length == 0 || state.ev == true) {
                        operands = [];
                        operands[0] = state.operand;
                        lastOp = payload.opcode;
                        return { operand: "0" };
                    }
                    console.log(state.operand);
                    operands[0] = evaluate(operands[0], state.operand, lastOp);
                    operands[1] = state.operand;
                    lastOp = payload.opcode;
                    return { 
                        operand: operands[0],
                        clear: true
                    };
                }
                case OPERATIONS.EVAL: {
                    if(operands.length == 0) return state;
                    if(operands.length == 1) operands[1] = state.operand;
                    if(state.ev == true) {
                        operands[0] = evaluate(operands[0], operands[1], lastOp);
                    } else {
                        operands[0] = evaluate(operands[0], state.operand, lastOp);
                        operands[1] = state.operand;
                    }
                    return { 
                        operand: operands[0],
                        clear: true,
                        ev: true
                    };
                }
                case OPERATIONS.CHS: {
                    operands = [];
                    return {
                        operand: parseFloat(state.operand) * -1,
                        clear: true
                    }
                }
            }
        }
    }
}

function Calculator() {
    const [{ operand }, dispatch] = useReducer(reducer, {operand: "0"});

    return (
        <div className='calculatorPane'>
          <div className='output'>{ operand }</div>
          <OperationButton dispatch={dispatch} operation={OPERATIONS.CLEAR} cl='span-two' />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.CHS} />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.DIV} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.MUL} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.SUM} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.DIFF} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <OperationButton dispatch={dispatch} operation={OPERATIONS.EVAL} cl='span-two' />
        </div>
    );
}

export default Calculator;