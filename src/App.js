import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./style.css";

/* action type constant */
export const ACTIONS = {
	ADD_DIGIT: "add-digit",
	CLEAR: "clear",
	DEL_DIGIT: "delete-digit",
	CHOOSE_OPERATION: "choose-operation",
	EVALUATE: "evaluate",
};
/* Reducer function to update state object (all the logic)*/
function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			// Edge Case 1: "0000000123", return current state
			if (state.currentOperand === "0" && payload.digit === "0") return state;
			// Edge Case 2: "10.........4", return current state
			if (payload.digit === "." && state.currentOperand?.includes(".")) return state;
			// Edge Case 3: after evaluation, overwrite the result
			if (state.overwrite)
				return { ...state, currentOperand: payload.digit, overwrite: false };
			// Normal Case:
			return { ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}` };
		case ACTIONS.CHOOSE_OPERATION:
			// Edge Case: no operands
			// a == null is true if the value of a is null or undefined.
			if (state.currentOperand == null && state.previousOperand == null) return state;
			// Case 1: only one operand
			if (state.previousOperand == null)
				return {
					...state,
					currentOperand: null,
					previousOperand: state.currentOperand,
					operation: payload.operation,
				};
			// Case 2: change operation (eg: 2+2+*)
			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}
			//  Case 3: two operands, operation trigger auto evaluate (eg: 2+2+ become 4)
			return {
				...state,
				previousOperand: evaluation(state),
				currentOperand: null,
				operation: payload.operation,
			};
		case ACTIONS.EVALUATE:
			// Edge Case: Either operand or operation missing, do nothing
			if (
				state.currentOperand == null ||
				state.previousOperand == null ||
				state.operation == null
			)
				return state;
			// Normal Case (default):
			return {
				...state,
				overwrite: true,
				operation: null,
				previousOperand: null,
				currentOperand: evaluation(state),
			};
		case ACTIONS.CLEAR:
			return {};
		case ACTIONS.DEL_DIGIT:
			// Case 1: After evaluation (=)
			if (state.overwrite)
				return {
					...state,
					currentOperand: null,
					overwrite: false,
				};
			// Case 2: current operand == null, do nothing
			if (state.currentOperand == null) return state;
			// Case 3: when current operand only 1 digit,
			// -- initialize currentOperand as null, rather than "" empty string
			if (state.currentOperand.length === 1) return { ...state, currentOperand: null };
			// Default Case:
			return { ...state, currentOperand: state.currentOperand?.slice(0, -1) };
		default:
			return state;
	}
}
/* evaluate function for action type: "evaluate" or "choose-operation" */
function evaluation({ previousOperand, currentOperand, operation }) {
	const prev = parseFloat(previousOperand);
	const current = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(current)) return "";
	// Set initial result ""
	let computation = "";
	// eslint-disable-next-line default-case
	switch (operation) {
		case "÷":
			computation = prev / current;
			break;
		case "*":
			computation = prev * current;
			break;
		case "+":
			computation = prev + current;
			break;
		case "-":
			computation = prev - current;
			break;
	}
	return computation.toString();
}
/* 
	function for formatting integer with "," sepearation
		only for render/display use	
*/
function formatOperand(operand) {
	if (operand == null) return;
	const integerFormatter = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });
	const [integer, fraction] = operand.split(".", 2);
	// if integer, return formatted integer
	if (fraction == null) return integerFormatter.format(integer);
	// if fraction number, return formatted integer + fraction
	return `${integerFormatter.format(integer)}.${fraction}`;
}
/*  --------------UI component -------------------*/
export default function App() {
	// [state,dispatch]=useReducer(arg1, arg2)
	// -- arg1: defined reducer function
	// -- arg2: initial state
	// -- state: current state Object
	// -- dispatch: a built-in function used to dispatch an action object to reducer (arg1)
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});
	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operand">
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className="current-operand">{formatOperand(currentOperand)}</div>
			</div>
			<button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
			<OperationButton dispatch={dispatch} operation="÷" />
			<DigitButton dispatch={dispatch} digit="1" />
			<DigitButton dispatch={dispatch} digit="2" />
			<DigitButton dispatch={dispatch} digit="3" />
			<OperationButton dispatch={dispatch} operation="*" />
			<DigitButton dispatch={dispatch} digit="4" />
			<DigitButton dispatch={dispatch} digit="5" />
			<DigitButton dispatch={dispatch} digit="6" />
			<OperationButton dispatch={dispatch} operation="+" />
			<DigitButton dispatch={dispatch} digit="7" />
			<DigitButton dispatch={dispatch} digit="8" />
			<DigitButton dispatch={dispatch} digit="9" />
			<OperationButton dispatch={dispatch} operation="-" />
			<DigitButton dispatch={dispatch} digit="." />
			<DigitButton dispatch={dispatch} digit="0" />
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: { operation } })}>
				=
			</button>
		</div>
	);
}
