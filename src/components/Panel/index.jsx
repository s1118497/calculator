import React, { useState } from "react";
import "./index.css";

export default function Panel() {
	// State 1: Array to store operands, need 2 to start calculation, need only 1 if clear/del
	const [operandsArr, setOperands] = useState([]);

	// State 2: Operator to store what operation to do
	// +: add || -: minus || x: mul || ÷: div
	const [operator, setOperator] = useState("");

	// State 3: show current number (result/operand)
	let [display, setDisplay] = useState("");

	// State 4: Flags for presence of operands [1st operand, 2nd operand ...]
	let [flags, setFlags] = useState([0, 0]);

	/* ------------------------------------------------------------------------- */

	//  callback for operands number input, store operands
	const handleNumClick = () => (e) => {
		if (display.length >= 13) return;
		const text = e.target.innerText;
		// Condition 1: No operands
		if (operandsArr.length === 0) {
			if (operator) {
				setDisplay(text);
				setOperands([0, text]);
				setFlags([1, 0]);
			} else {
				setDisplay(text);
				setOperands([text]);
				setFlags([1, 0]);
			}
		}
		// Condition 2: One operand
		if (operandsArr.length === 1) {
			// Condition 2.1: no operator
			if (!operator) {
				let newText = display === "0" ? text : display + text;
				setDisplay(newText);
				setOperands([newText]);
			}
			// Condition 2.2: has operator
			else {
				setDisplay(text);
				setOperands([operandsArr[0], text]);
				setFlags([1, 1]);
			}
		}
		// Condition 3: Two operands (must have operator)
		if (operandsArr.length === 2) {
			// Condition 3.1: flags[1] = false (only autofill second when operator present)
			if (!flags[1]) {
				setDisplay(text);
				setOperands([operandsArr[0], text]);
				setFlags([1, 1]);
			}
			// Condition 3.2: flags[1] = true (user input second operand)
			else {
				let newText = display + text;
				setDisplay(newText);
				setOperands([operandsArr[0], newText]);
			}
		}
		if (display === "Infinity") {
			setDisplay(text);
			setOperands([text]);
			setFlags([1, 0]);
			setOperator("");
		}
	};

	// callback for operator click
	function handleOpClick(type) {
		if (!flags[0]) setOperator(type);
		if (flags[0] && !flags[1]) {
			// if (operandsArr[0] * 1 < 0 && type === "minus") setOperator("minus");
			if (operator) {
				// only for 負數 "+"
				// for: - 6 + 9
				if (type === "add") {
					handleEqClick();
					setOperator(type);
				}
			} else {
				setOperator(type);
				setOperands([operandsArr[0], operandsArr[0]]);
			}
		}
		// Only support +/-: 4 + 3 -/+ 2
		// Not support x/÷ : 4 - 3 * 2 = -2, beacuse it needs 3緩存
		if (flags[0] && flags[1]) {
			if (operator) {
				handleEqClick("op");
				setOperator(type);
				setFlags([1, 0]);
			}
		}
	}

	//  callback for "=", calculation
	function handleEqClick(op) {
		// When NO operands / Infinity
		if (!operandsArr.length || operandsArr.includes("Infinity") || !operator) return;
		const map = {
			// string operation supported, but be aware of "+" is considered as string concat!
			add: () =>
				operandsArr.length === 2
					? operandsArr[0] * 1 + (operandsArr[1] * 1 ?? operandsArr[0] * 1)
					: operandsArr[0] * 1,
			minus: () => operandsArr[0] - (operandsArr[1] ?? operandsArr[0]),
			mul: () =>
				operandsArr.length === 2 ? operandsArr[0] * (operandsArr[1] ?? operandsArr[0]) : 0,
			div: () => {
				let quotient = operandsArr[0] / (operandsArr[1] ?? operandsArr[0]);
				// for exception (0/0):  - > 3 > = > = > NaN
				if (operandsArr.length === 2) {
					if (isNaN(quotient)) return "Infinity";
					else return quotient;
				}
			},
		};
		const operation = map[operator];
		if (operation) {
			let result = operation();
			setDisplay(result.toString().slice(0, 14));
			op ? setOperands([result, result]) : setOperands([result, operandsArr[1]]);
			setFlags([1, 0]);
		}
	}

	//  callback for "AC", clear all state
	function clearAll() {
		return () => {
			setOperands([]);
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
					setOperands([updateText]);
				} else {
					setOperands([]);
					setFlags([0, 0]);
				}
			}
			// when 2 operands
			else if (updateText) {
				setOperands([operandsArr[0], updateText]);
			} else {
				setOperands([operandsArr[0], operandsArr[0]]);
				setFlags([1, 0]);
			}
		};
	}

	// callback for ".", handle decimal value
	function handleDeCiClick() {
		return () => {
			if (operandsArr.length === 2) {
				if (flags[1]) {
					if (display.includes(".")) return;
					else {
						let newText = display + ".";
						setDisplay(newText);
						setOperands([operandsArr[0], newText]);
						setFlags([1, 1]);
					}
				} else if (!flags[1]) {
					let newText = "0.";
					setDisplay(newText);
					setOperands([operandsArr[0], newText]);
					setFlags([1, 1]);
				}
			}

			if (operandsArr.length <= 1) {
				if (display.includes(".")) return;
				else {
					let newText = display ? display + "." : "0.";
					setDisplay(newText);
					setOperands([newText]);
					setFlags([1, 0]);
				}
			}
		};
	}

	return (
		<div className="panel-container">
			<div className="result">{display ? display : "0"}</div>
			{/* <div className="result">12314323551513516136363</div> */}
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

			<button className="panel-item " onClick={handleDeCiClick()}>
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
