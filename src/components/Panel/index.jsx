import React from "react";
import "./index.css";

export default function Panel() {
	return (
		<div className="panel-container">
			<div className="result">result</div>
			<button className="panel-item ac">AC</button>
			<button className="panel-item ">DEL</button>
			<button className="panel-item ">÷</button>

			<button className="panel-item ">1</button>
			<button className="panel-item ">2</button>
			<button className="panel-item ">3</button>
			<button className="panel-item ">x</button>

			<button className="panel-item ">4</button>
			<button className="panel-item ">5</button>
			<button className="panel-item ">6</button>
			<button className="panel-item ">+</button>

			<button className="panel-item ">7</button>
			<button className="panel-item ">8</button>
			<button className="panel-item ">9</button>
			<button className="panel-item ">-</button>

			<button className="panel-item ">.</button>
			<button className="panel-item ">0</button>
			<button className="panel-item equal">=</button>
		</div>
	);
}
