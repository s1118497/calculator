import React, { useState } from "react";
import "./index.css";

export default function Panel() {
	// State 1: Array to store operands, need 2 to start calculation, need only 1 if clear/del
	const [operandsArr, setOperand] = useState([]);

	// State 2: Operator to store what operation to do
	// +: add || -: minus || x: mul || ÷: div
	const [operator, setOperator] = useState("");

	// State 3: show current number (result/operand)
	let [display, setDisplay] = useState("");

	// State 4: Flags for presence of operands [1st operand, 2nd operand ...]
	let [flags, setFlags] = useState([0, 0]);

	// // State 5: Flag for decimal
	// let [decimal, setDecimal] = useState(false);
	/* ------------------------------------------------------------------------- */
	//  callback for operands number input, store operands
	const handleNumClick = () => (e) => {
		const text = e.target.innerText;
		const value = text * 1;
		// Condition 1: No operands
		if (operandsArr.length === 0) {
			// Condition 1.1: no operator ABSENT
			if (!operator) {
				setDisplay(value.toString());
				setOperand([value]);
				setFlags([1, 0]);
			}
			// Condition 1.2:  operator PRESENT
			else {
				setDisplay(value.toString());
				setOperand([0, value]);
				setFlags([1, 1]);
			}
		}
		// Condition 2: One operand
		if (operandsArr.length === 1) {
			// Condition 2.1: no operator
			if (!operator) {
				let newText = display
					? display + text
					: display === "0"
					? operandsArr[0] + text
					: text;
				let newValue = newText * 1;
				setDisplay(newValue.toString());
				setOperand([newValue]);
			}

			// Condition 2.2: has operator
			else {
				// Condition 2.2.1: number > operator > number --> accept 2nd number
				if (flags[0]) {
					setDisplay(value.toString());
					setOperand([operandsArr[0], value]);
					setFlags([1, 1]);
				}
				// Condition 2.2.1:   operator > number > number --> update 1st number
				else {
					let newText = operandsArr[0] + text;
					// for 1 exception: 0 start, display will be 01213, convert to number to avoid
					let newValue = newText * 1;
					setDisplay(newValue.toString());
					setOperand([newValue]);
				}
			}
		}
		// Condition 3: Two operands (must have operator)
		if (operandsArr.length === 2) {
			// Condition 3.1: flags[1] = false (only autofill second when operator present)
			if (!flags[1]) {
				setDisplay(text);
				setOperand([operandsArr[0], value]);
				setFlags([1, 1]);
			}
			// Condition 3.2: flags[1] = true (user input second operand)
			else {
				let newText = operandsArr[1] + text;
				let newValue = newText * 1;
				// for 1 exception: 0 start, display will be 01213, convert to number to avoid
				setDisplay(newValue.toString());
				setOperand([operandsArr[0], newValue]);
				setFlags([1, 1]);
			}
		}
	};

	// callback for operator click
	function handleOpClick(type) {
		// // Conditino 0: when no operand
		// if (operandsArr.length === 0) setOperator(type);
		// // Condition 1: when 1 operand, default 2nd = 1st operand
		// if (operandsArr.length === 1) {
		// 	// Condition 1.1: if operator present, execute with 0 then update operator
		// 	if (operator) {
		// 		setOperand([0, operandsArr[0]]);
		// 		handleEqClick();
		// 		setOperator(type);
		// 	}
		// 	// Condition 1.2: if  operator absent
		// 	else {
		// 		setOperator(type);
		// 		setOperand([operandsArr[0], operandsArr[0]]);
		// 		setFlags([1, 0]);
		// 	}
		// }
		// // Condition 2: when 2 operands (imply operator PRESENT), calculate then update operator
		// if (operandsArr.length === 2) {
		// 	handleEqClick();
		// 	setOperator(type);
		// }

		if (!flags[0]) setOperator(type);
		if (flags[0] && !flags[1]) {
			setOperator(type);
			setOperand([operandsArr[0], operandsArr[0]]);
		}
		// case 1: operator > num > operator
		// case 2: num > operator > num > operator
		if (flags[0] && flags[1]) {
			if (operator) {
				// First calculate
				handleEqClick();
				// Then update operator
				setOperator(type);
			}
		}
	}

	//  callback for "=", calculation
	function handleEqClick() {
		// When NO operands / Infinity
		if (!operandsArr.length || operandsArr.includes("Infinity")) return;
		const map = {
			add: () => operandsArr[0] + (operandsArr[1] ?? operandsArr[0]),
			minus: () => operandsArr[0] - (operandsArr[1] ?? operandsArr[0]),
			mul: () => operandsArr[0] * (operandsArr[1] ?? operandsArr[0]),
			div: () => operandsArr[0] / (operandsArr[1] ?? operandsArr[0]),
		};
		const operation = map[operator];
		if (operation) {
			let result = operation();
			setDisplay(result.toString());
			setOperand([result, operandsArr[1]]);
			// setOperator("");
			setFlags([1, 0]);
		}
	}

	//  callback for "AC", clear all state
	function clearAll() {
		return () => {
			setOperand([]);
			setDisplay("");
			setOperator("");
			setFlags([0, 0]);
		};
	}

	// callback for "del", backspace display and current operand
	function handleDelClick() {
		return () => {
			// when no display, just EXIT for performance efficiency
			if (!display || display === "Infinity") return;
			let updateText = display.slice(0, -1);
			setDisplay(updateText);
			// when 1 operands
			if (!flags[1]) {
				setOperator("");
				// ("" * 1) => 0 ; parseInt("")=> NaN
				if (updateText) {
					setOperand([updateText * 1]);
				} else {
					setOperand([]);
					setFlags([0, 0]);
				}
			}
			// when 2 operands
			else if (updateText) {
				setOperand([operandsArr[0], updateText * 1]);
			} else {
				setOperand([operandsArr[0], operandsArr[0]]);
				setFlags([1, 0]);
			}
		};
	}

	// callback for ".", handle decimal value
	function handleDeciClick() {
		return () => {
			if (display.includes(".")) return;
			setDisplay((oldDisplay) => oldDisplay + ".");
		};
	}

	return (
		<div className="panel-container">
			<div className="result">{display ? display : "0"}</div>
			<button className="panel-item ac" onClick={clearAll()}>
				AC
			</button>
			<button className="panel-item " onClick={handleDelClick()}>
				DEL
			</button>
			<button className="panel-item " onClick={() => handleOpClick("div")}>
				÷
			</button>

			<button className="panel-item " onClick={handleNumClick()}>
				1
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				2
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				3
			</button>
			<button className="panel-item " onClick={() => handleOpClick("mul")}>
				x
			</button>

			<button className="panel-item " onClick={handleNumClick()}>
				4
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				5
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				6
			</button>
			<button className="panel-item " onClick={() => handleOpClick("add")}>
				+
			</button>

			<button className="panel-item " onClick={handleNumClick()}>
				7
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				8
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				9
			</button>
			<button className="panel-item " onClick={() => handleOpClick("minus")}>
				-
			</button>

			<button className="panel-item " onClick={handleDeciClick()}>
				.
			</button>
			<button className="panel-item " onClick={handleNumClick()}>
				0
			</button>
			<button className="panel-item equal" onClick={() => handleEqClick()}>
				=
			</button>
		</div>
	);
}
