import React from "react";
import {
	Button,
	Container,
	Row,
	Col,
	ProgressBar,
	Modal,
	InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "./App.scss";

class App extends React.Component {
	constructor() {
		super();
		this.pt = 25;
		this.st = 5;
		this.lt = 15;
		this.maxSessionCount = 4;
		this.tick = null;
		this.state = {
			sessionCount: 0,
			mode: "pt",
			mins: this.pt,
			secs: 0,
			theme: "red",
			isTimerOn: false,
			percent: 0,
			show: false,
			pt: this.pt,
			st: this.st,
			lt: this.lt,
		};
		this.handleShort = this.handleShort.bind(this);
		this.handlePomodoro = this.handlePomodoro.bind(this);
		this.handleLong = this.handleLong.bind(this);
		this.handleTimer = this.handleTimer.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}
	updatePt(e) {
		console.log(e.target.value);
		if (e.target.value != "") {
			this.setState({ pt: e.target.value });
		}
	}
	updateSt(e) {
		console.log(e.target.value);
		if (e.target.value != "") {
			this.setState({ st: e.target.value });
		}
	}
	updateLt(e) {
		console.log(e.target.value);
		if (e.target.value != "") {
			this.setState({ lt: e.target.value });
		}
	}

	handlePomodoro() {
		this.setState({ mins: this.pt, mode: "pt" });
	}

	handleShort() {
		this.setState({ mins: this.st, mode: "st" });
	}

	handleLong() {
		//console.log("lt");

		this.setState({ mins: this.lt, mode: "lt" });
	}

	handleTimer() {
		let started = this.state.isTimerOn;
		if (started) {
			// stopped
			this.stop();
		} else {
			// start
			this.setState({ isTimerOn: true }, () => {
				this.start();
			});
		}
	}

	stop() {
		clearInterval(this.tick);
		let mode = this.state.mode;
		let min = 0;
		if (mode === "pt") {
			min = this.pt;
		} else if (mode === "st") {
			min = this.st;
		} else if (mode === "lt") {
			min = this.lt;
		}
		this.setState({
			sessionCount: 0,
			mode: mode,
			mins: min,
			secs: 0,
			theme: "red",
			isTimerOn: false,
			percent: 0,
		});
	}
	start() {
		let startTime = new Date().getTime();
		let duration = this.state.mins * 60 * 1000;
		let endTime = startTime + duration;
		let sec = 59;
		let min = 0;
		this.tick = setInterval(() => {
			let cur = new Date().getTime();
			let diff1 = endTime - cur;
			min = this.getMins(diff1);
			// sec
			if (sec === 0) {
				--sec;
				sec = 59;
			} else {
				--sec;
			}
			let per = 100 - Math.floor((diff1 / duration) * 100);
			this.setState({
				mins: min,
				secs: sec,
				isTimerOn: true,
				percent: per,
			});
		}, 1000);
		setTimeout(() => {
			this.stop();
		}, this.state.mins * 60 * 1000);
	}

	getMins(time) {
		time = Math.floor(time / (60 * 1000));
		return time;
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleClose() {
		this.setState({ show: false });
	}
	render() {
		let theme = `theme-${this.state.mode}`;
		document.body.classList.remove("theme-pt");
		document.body.classList.remove("theme-st");
		document.body.classList.remove("theme-lt");
		document.body.classList.add(theme);
		// console.log(this.state);
		return (
			<Container className="outer-main">
				<Row className="title-row">
					<Col md="8" className="title">
						Focus using Pomodoro
					</Col>
					<Col className="setting">
						<Button
							className={`btn-setting-${this.state.mode}`}
							onClick={this.handleShow}
						>
							<FontAwesomeIcon icon={faCog} /> Settings
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Container className="main">
							<Row>
								<Col>
									<Button
										className="btn-app"
										onClick={this.handlePomodoro}
									>
										Pomodoro
									</Button>
								</Col>
								<Col>
									<Button
										className="btn-app"
										onClick={this.handleShort}
									>
										Short Break
									</Button>
								</Col>
								<Col>
									<Button
										className="btn-app"
										onClick={this.handleLong}
									>
										Long Break
									</Button>
								</Col>
							</Row>
							<Row>
								<Col className="display">
									<span id="timer-mins">
										{this.state.mins < 10
											? `0${this.state.mins}`
											: this.state.mins}
									</span>
									:
									<span id="timer-secs">
										{this.state.secs < 10
											? `0${this.state.secs}`
											: this.state.secs}
									</span>
								</Col>
							</Row>
							<Row>
								<Col>
									<Button
										className="btn-start"
										onClick={this.handleTimer}
									>
										{this.state.isTimerOn === false
											? "START"
											: "STOP"}
									</Button>
								</Col>
							</Row>
							<Row>
								<Col>
									<ProgressBar
										now={this.state.percent}
										className="progressBar"
									/>
								</Col>
							</Row>
						</Container>
					</Col>
				</Row>
				<Modal
					show={this.state.show}
					onHide={this.handleClose}
					animation={false}
					className="customModal"
				>
					<Modal.Header closeButton>
						<Modal.Title>Settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col>Time (minutues)</Col>
						</Row>
						<Row>
							<Col>Pomodoro</Col>
							<Col>Short Break</Col>
							<Col>Long Break</Col>
						</Row>
						<Row>
							<Col>
								<input
									type="number"
									min="1"
									step="1"
									max="25"
									value={this.state.pt}
									onChange={(e) => this.updatePt(e)}
									maxLength="2"
								></input>
							</Col>
							<Col>
								<input
									type="number"
									min="1"
									step="1"
									max="25"
									value={this.state.st}
									onChange={(e) => this.updateSt(e)}
								></input>
							</Col>
							<Col>
								<input
									type="number"
									min="1"
									step="1"
									max="25"
									value={this.state.lt}
									onChange={(e) => this.updateLt(e)}
								></input>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="success" onClick={this.handleClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		);
	}
}

export default App;
