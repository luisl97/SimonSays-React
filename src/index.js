import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { setTimeout } from "timers";

class Button extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            color: props.color
        }
    }

    render(){
        return (
                <button     
                className="square" 
                onClick= { () => this.props.onClick()}
                style={{backgroundColor: this.props.color}}>
                    {this.props.color}
                </button>
        )
    }
}

class Board extends React.Component {

    renderButton(color){
        return(
            <Button
                onClick= {() => this.props.onClick(color)}
                color={color}
            />
        )
    }


    render(){
        return(
            <div>
                <div className="board-row">
                    {this.renderButton(this.props.colors[0])}
                    {this.renderButton(this.props.colors[1])}
                </div>
                <div className="board-row">
                    {this.renderButton(this.props.colors[2])}
                    {this.renderButton(this.props.colors[3])}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            gameStatus: "Pending",
            playerColors: [],
            colorHistory: [],
            colors: ['Red', 'Blue', 'Yellow', 'Green'],
            gameSpeed: 200,
            playerStep: 0
        }
    }

    startGame(){
        this.setState({
            gameStatus: "Showing Turn"
        })
        console.log(this.state.gameStatus)
        this.showNextRound(this.state.colors, this.state.colorHistory)
    }

    async showNextRound(){
        var colors = this.state.colors
        var colorHistory = this.state.colorHistory

        var newColor = colors[Math.floor(Math.random()*colors.length)]

        colorHistory.push(newColor)

        for(let i = 0; i < colorHistory.length; i++){

            var j = colors.indexOf(colorHistory[i])

            colors[j] = "White"

            

            await Promise.all([
                this.setState({
                    colors,
                    colorHistory
                }), timeout(this.state.gameSpeed)])

            

            colors = ['Red', 'Blue', 'Yellow', 'Green']

            await Promise.all([
                this.setState({
                    colors
                }), timeout(this.state.gameSpeed)])

        }
    }
    

    handleClick(color){
        if(this.state.gameStatus === "Player's Turn"){
            var colorHistory = this.state.colorHistory
            var playerColors = this.state.playerColors.slice().concat([color])
            var playerStep = this.state.playerStep + 1
            this.setState({
                playerColors,
                playerStep
            })
            console.log(playerStep, playerColors)

            if(playerStep === colorHistory.length){
                verifySteps(playerColors, colorHistory)
            }
        }
    }

    render() {
        const colorHistory = this.state.colorHistory
        const colors = this.state.colors
        const colorsList = colorHistory.map((color) => {
            return (
                <li>
                    {color}
                </li>
            )
        })

        console.log(colors)

        return(
            <div className="game">
                <div className="game-board">
                    <Board 
                    onClick={(color) => this.handleClick(color)}
                    colors={colors}/>
                </div>
                <div className="game-info">
                    {true && 
                        <div className="info-row">
                            <button onClick={() => this.startGame()}>Start Game</button>
                        </div>
                    }
                    <div className="info-row">
                        {colorsList}
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById("root")
);

async function verifySteps(){
    console.log("verifying steps")
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}