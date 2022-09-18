import React from "react";
import "./index.css";

export default function Panel() {
	return (
		<div className="panel-container">
			<button className="panel-item ac">AC</button>
			<button className="panel-item del">DEL</button>
			<button className="panel-item div">÷</button>

			<button className="panel-item one">1</button>
			<button className="panel-item two">2</button>
			<button className="panel-item three">3</button>
			<button className="panel-item mul">x</button>

			<button className="panel-item four">4</button>
			<button className="panel-item five">5</button>
			<button className="panel-item six">6</button>
			<button className="panel-item add">+</button>

			<button className="panel-item seven">7</button>
			<button className="panel-item eight">8</button>
			<button className="panel-item nine">9</button>
			<button className="panel-item minus">-</button>

			<button className="panel-item dot">.</button>
			<button className="panel-item zero">0</button>
			<button className="panel-item equal">=</button>
		</div>
	);
}
