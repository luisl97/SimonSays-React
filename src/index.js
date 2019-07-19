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
            gameStatus: "Game Over",
            playerColors: [],
            colorHistory: [],
            colors: ['Red', 'Blue', 'Yellow', 'Green'],
            gameSpeed: 200,
            playerStep: 0
        }
    }

    async startGame(){
        if(this.state.gameStatus === "Game Over"){
            await this.setState({
                gameStatus: "Showing Turn",
                playerColors: [],
                playerStep: 0,
                colorHistory: []
            })
            this.showNextRound(this.state.colors, this.state.colorHistory)
        }
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

        this.setState({
            gameStatus: "Player Turn"
        })
        console.log(this.state.gameStatus)


    }
    

    async handleClick(color){
        if(this.state.gameStatus === "Player Turn"){
            var colorHistory = this.state.colorHistory
            var playerColors = this.state.playerColors.slice().concat([color])
            var playerStep = this.state.playerStep + 1
            this.setState({
                playerColors,
                playerStep
            })

            console.log(this.state.gameStatus)

            if(playerStep === colorHistory.length){
                var result = await verifySteps(playerColors, colorHistory)
                if(result){    
                    this.setState({
                        gameStatus: "Showing Turn",
                        playerColors: [],
                        playerStep: 0
                    })
                    this.showNextRound()
                } else {
                    this.setState({
                        gameStatus: "Game Over"
                    })
                }
            }
        }
    }

    render() {
        const playerColors = this.state.playerColors
        const colors = this.state.colors
        const colorsList = playerColors.map((color) => {
            return (
                <li>
                    {color}
                </li>
            )
        })

        return(
            <div className="game">
                <h1>{this.state.gameStatus}</h1>
                <div className="game-board">
                    <Board 
                    onClick={(color) => this.handleClick(color)}
                    colors={colors}/>
                </div>
                <div className="game-info">
                    {this.state.gameStatus === "Game Over" && 
                        <div className="info-row">
                            <button onClick={() => this.startGame()}>Start Game</button>
                        </div>
                    }
                    <div className="info-row">
                        <h1>Colors Chosen:</h1>
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

async function verifySteps(chosenColors, colorHistory){
    console.log("verifying steps")

    let i
    for(i = 0; i < chosenColors.length; i++){
        if(chosenColors[i] !== colorHistory[i]){
            return false
        }
    }

    return true
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}