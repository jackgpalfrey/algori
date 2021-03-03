import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import bubbleSort from '../../algoithms/sorting/bubbleSort'
import heapSort from '../../algoithms/sorting/heapSort'
import insertionSort from '../../algoithms/sorting/insertionSort'
import mergeSort from '../../algoithms/sorting/mergeSort'
import quickSort from '../../algoithms/sorting/quickSort'
import reverseArray from '../../algoithms/sorting/reverseArray'
import selectionSort from '../../algoithms/sorting/selectionSort'
import Console from '../Console'
import InfoCard from '../InfoCard'
import algoData from '../../data/algorithmInfo.json'
import './style.css'


const COLORS = {
    BASE: '#035efc', 
    CHECKING: 'red',
    DONE: '#0f8707',
    TEXT: 'white'
    
}

function SortingVisualiser(props){

    //#region State Creation 
    const cookieData = document.cookie.replace(';','').replace(' ','').split(',')
    let animationtype = cookieData[0]
    let urlAnimation = useLocation().search.replace('?','')
    if (urlAnimation && Object.keys(algoData['sorting']).includes(urlAnimation)) animationtype = urlAnimation
    if(!Object.keys(algoData['sorting']).includes(urlAnimation)) animationtype = 'bubbleSort'
    const [array, setArray] = useState([])
    const [animationSpeed, setAnimationSpeed] = useState(cookieData[0] || 100)
    const [numBars, setNumBars] = useState(Math.round((window.innerWidth / 12) / 2))
    const [runTime, setRunTime] = useState(0)
    const [swaps, setSwaps] = useState(0)
    const [comparisons, setComparisons] = useState(0)
    const [animationActive, setAnimationActive] = useState(false)
    const [activeAlgorithm, setActiveAlgorithm] = useState(animationtype || 'bubbleSort')
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [activeTimeouts, setActiveTimeouts] = useState([])
    const [activeIntervals, setActiveIntervals] = useState([])

    //#endregion
    
    useEffect(effect => {
        document.cookie = `${animationSpeed},${activeAlgorithm};`;
    },[animationSpeed, activeAlgorithm])
    

    useEffect(effect => {
        AnimateEngine(["resetArray",numBars])
    }, [])


    function AnimateEngine(command){
        try {
            let commandCode = command[0]
            
            let response = ["PENDING", "In progress"]
            switch(commandCode){
                case 'setState':
                        let indexArray = command[1]
                        let type = command[2]
                        let data = command[3]

                        if (!indexArray || !Array.isArray(indexArray)) return ["ERROR", "Invalid Indexs"]
                        if (!type || typeof type !== 'string') return ["ERROR", "Invalid Type"]
                        
                        type = type.toLowerCase()

                        if (type === 'color'){
                            if(typeof data !== 'string') return ["ERROR", "Invalid Data"]
                            if (data.includes('$')) data = COLORS[data.replace('$','')]
                        } else if (type === 'value'){
                            if(typeof data !== 'number') return ["ERROR", "Invalid Data"]
                        } else {
                            return ["ERROR", "Invalid Type"]
                        }


                        setArray(prevState => {
                            let newArray = prevState.slice()
                            
                            indexArray.forEach(idx => {
                                if (typeof idx == "number" && idx >= 0 && idx < newArray.length){
                                    newArray[idx][type] = data

                                } if (typeof idx == "number" && idx < 0 && Math.abs(idx) <= newArray.length){
                                    newArray[newArray.length - Math.abs(idx)][type] = data
                                
                                } else if (idx === '$ALL'){
                                    for (let y = 0; y < newArray.length; y++){
                                        newArray[y][type] = data
                                    }
                                } else if (idx === '$LHALF'){
                                    for (let y = 0; y < Math.ceil(newArray.length / 2); y++){
                                        newArray[y][type] = data
                                    }
                                } else if (idx === '$RHALF'){
                                    for (let y = Math.floor(newArray.length / 2); y < newArray.length; y++){
                                        newArray[y][type] = data
                                    }
    
                                } else if (idx === '$ODD'){
                                    for (let y = 0; y < newArray.length; y++){
                                        if (y % 2 === 0) newArray[y][type] = data
                                        
                                    }
    
                                } else if (idx === '$EVEN'){
                                    for (let y = 0; y < newArray.length; y++){
                                        if (y % 2 === 1) newArray[y][type] = data
                                    }
    
                                } else if (idx === '$MID'){
                                    newArray[Math.floor((newArray.length - 1) / 2)][type] = data
                                    newArray[Math.ceil((newArray.length - 1) / 2)][type] = data
    
                                }
                                
                                
                            });
                            
                            return newArray
                        });
                            

                    break;
                
                case 'sc':
                case 'setColor': // Sets color of bars. Syntax: ["setColor",[array of ids or $ALL, $LHALF, $RHALF], "valid css color OR valid inbuilt variable prefixed with $"]
                    let idxes = command[1]
                    let color = command[2]
                    
                    AnimateEngine(["setState", idxes, 'color', color])
                    break;
                
                case 'swap':
                    let id1 = command[1]
                    let id2 = command[2]
                    if (id1 == undefined || typeof id1 !== 'number') return ["ERROR", "Invalid id1"]
                    if (id2 == undefined || typeof id2 !== 'number') return ["ERROR", "Invalid id2"]
                    setArray(prevState => {
                        id1 = command[1]
                        id2 = command[2]
                        let newArray = prevState.slice()

                        if (id1 < 0) id1 = newArray.length - Math.abs(id1)
                        if (id2 < 0) id2 = newArray.length - Math.abs(id2)
                        
                        if (id1 >= 0 && id1 < newArray.length && id2 >= 0 && id2 < newArray.length){
                            const tmp1 = {...newArray[id1]}
                            const tmp2 = {...newArray[id2]}
                            newArray[id1] = tmp2
                            newArray[id2] = tmp1
                        }
                        
        
                        return newArray
                    })
        
                    break;
                
                case 'setValue':
                    let idxs = command[1]
                    let value = command[2]

                    AnimateEngine(["setState", idxs, 'value', value])
                    break;
                
                case 'setArray':
                    let values = command[1]
                    let colorCode = command[2]

                    if (!values || !Array.isArray(values)) return ["ERROR", "Invalid Values"]
                    if (!colorCode || typeof colorCode !== 'string') return ["ERROR", "Invalid Color"]
                    setArray(prevState => {
                        let newArray = []
                        let color = command[2]
                        if (color.includes('$')) color = COLORS[color.replace('$','')]
        
                        values.forEach(value => {
                        if (typeof value == "number"){
                                newArray.push({value: value, color: color})
                            }
                            
                        });
                        setNumBars(newArray.length)
                        return newArray
                    })
                    break;
                        
                case 'do':
                    let subCommands = command[1]
                    let interval = command[2]

                    if (!subCommands || !Array.isArray(subCommands)) return ["ERROR", "Invalid Sub Commands"]
                    if (!interval && interval != 0 || typeof interval !== 'number' && interval != '$userSet' || interval < 0) return ["ERROR", "Invalid Interval"]
                    if (interval == '$userSet') interval = animationSpeed
                   
                    if (interval == 0) {
                        for (let i = 0; i < subCommands.length; i++){
                            AnimateEngine(subCommands[i])
                        }
                        break; 
                    }


                    

                    AnimateEngine(subCommands[0])
                    let currentCommandIdx = 1

                    let intervalID = setInterval(() => {
                        if (currentCommandIdx >= subCommands.length){
                            clearInterval(intervalID)
                            //AnimateEngine(["clearLoop", `${intervalID}`])
                            return
                        }

                        AnimateEngine(subCommands[currentCommandIdx])
                        currentCommandIdx++
                    }, interval)

                    setActiveIntervals(prevState => {
                        let curIntervals = prevState.slice()
                        curIntervals.push(intervalID)
                        return curIntervals
                    })
                    break;
                
                case 'doFor':
                    let commandsToRun = command[1]
                    let repeats = command[2]
                    let intervalBetweenEach = command[3]

                    if (!commandsToRun || !Array.isArray(commandsToRun)) return ["ERROR", "Invalid Sub Commands"]
                    if (!repeats && repeats !== 0 || typeof repeats !== 'number' || repeats < 0) return ["ERROR", "Invalid Repeats"]
                    if (!intervalBetweenEach && intervalBetweenEach !== 0 || (typeof intervalBetweenEach !== 'number' && intervalBetweenEach !== '$userSet') || intervalBetweenEach < 0) return ["ERROR", "Invalid Interval"]

                    if (intervalBetweenEach === '$userSet'){
                        intervalBetweenEach = parseInt(animationSpeed)
                    }
                    
                    let currentIteration = 1

                    AnimateEngine(["do", commandsToRun, intervalBetweenEach])
                    
                    let intervalIdentifier = setInterval(() => {
                        if (currentIteration >= repeats && repeats !== 0) {
                            clearInterval(intervalIdentifier)
                            return;
                        }

                        AnimateEngine(["do", commandsToRun, intervalBetweenEach])

                        currentIteration++
                    }, intervalBetweenEach * commandsToRun.length)

                    setActiveIntervals(prevState => {
                        let curAIntervals = prevState.slice()
                        curAIntervals.push(intervalIdentifier)
                        return curAIntervals
                    })
                    break;

                case 'doSim':
                    let toRunCommands = command[1]
                    AnimateEngine(["do", toRunCommands, 0])
                    break;

                case 'doIn':
                    let commandsToExecute = command[1]
                    let waitFor = command[2]

                    if (!commandsToExecute || !Array.isArray(commandsToExecute)) return ["ERROR", "Invalid Sub Commands"]
                    if (!waitFor || typeof waitFor !== 'number' || waitFor <= 0) return ["ERROR", "Wait Time Invalid"]
                    let timeoutID = setTimeout(() => {
                        command[1].forEach((value) => {
                            console.log(value)
                            AnimateEngine(value)
                        })
                    }, command[2] )

                    setActiveTimeouts(prevState => {
                        let curTimeouts = prevState.slice()
                        curTimeouts.push(timeoutID)
                        return curTimeouts
                    })

                    break;
                
                case 'ra':
                case 'resetArray':
                    
                    let numOfBars = command[1]
                    if (!numOfBars) numOfBars = numBars
                    if (typeof numOfBars !== 'number') return ["ERROR", "Invalid Number of bars"]
                    let Randvalues = []
                    for (let i = 0; i < numOfBars; i++){
                        Randvalues.push(Math.round(Math.random() * 60) + 8)
                    }
                    AnimateEngine(["setArray",Randvalues,"$BASE"])
                    break;
                
                case 'setRunTimeDisplay':
                    let newRuntime = command[1]
                    if (!newRuntime) return ["ERROR", "Invalid Runtime"]
                    setRunTime(newRuntime)
                    break;

                case 'setComparisonsDisplay':
                    let newComparisons = command[1]
                    if (!newComparisons) return ["ERROR", "Invalid Comparisons"]
                    setComparisons(newComparisons)
                    break;

                case 'setSwapsDisplay':
                    let newSwaps = command[1]
                    if (!newSwaps) return ["ERROR", "Invalid Swaps"]
                    setSwaps(newSwaps)
                    break;

                case 'startAnimation':
                    setAnimationActive(true)
                    break;

                case 'endAnimation':
                    setAnimationActive(false)
                    break;

                case 'clearLoop': //FIXME: Dosen't work
                    let specificLoop = command[1]
                    let activeLoops = activeIntervals.slice()
                    if (specificLoop == undefined){
                        let ALLen = activeLoops.length
                        for (let i = 0; i < ALLen; i++){
                            clearInterval(activeLoops.pop())
                        }
                    } else if (typeof specificLoop === 'number') {
                        let loop = activeLoops.splice(specificLoop, 1)[0]
                        console.log(loop)
                        clearInterval(loop)
                    } else if (typeof specificLoop === 'string'){
                        let loop = activeLoops.indexOf(parseInt(specificLoop))[0]
                        console.log(loop)
                        clearInterval(loop)
                    }

                    setActiveIntervals(activeLoops)
                    
                    
                    break;

                case 'clearWaits': //FIXME: Dosen't work
                    let activeWaits = activeTimeouts.slice()
                    let AWLen = activeWaits.length
                    for (let i = 0; i < AWLen; i++){
                        clearTimeout(activeWaits.pop())
                    }
                    break;
                
                case 'ct':
                case 'clearTimers': //FIXME: Dosen't work
                    AnimateEngine(["clearLoops"])
                    AnimateEngine(["clearWaits"])
                    break;
                
                case 'r':
                case 'reload':
                    window.location.reload()
                    break;
                    
                case 'executeInternalAnimation':
                    let animationKey = command[1]
                    console.log(animationKey)
                    if (!animationKey || typeof animationKey !== 'string' ) return ["ERROR", "Invalid Animation Key"]
                    let resultData = []
                    let isLegacy = false
                    switch(animationKey){
                        case 'bubbleSort':
                            resultData = bubbleSort(getNumbersFromArrayState())
                            break;
                        case 'selectionSort':
                            resultData = selectionSort(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        case 'insertionSort':
                            resultData = insertionSort(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        case 'quickSort':
                            return alert('Currently Unavailable')
                            resultData = quickSort(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        case 'heapSort':
                            resultData = heapSort(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        case 'mergeSort':
                            return alert('Currently Unavailable')
                            resultData = mergeSort(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        case 'reverseArray':
                            resultData = reverseArray(getNumbersFromArrayState())
                            isLegacy = true
                            break;
                        default:
                            return ["ERROR", "Invalid Animation Key"]
                            break;
                    }

                    // Legacy
                    if (isLegacy){
                        let [animations,runTime] = resultData
                        AnimateEngine(["setRunTimeDisplay", Math.round(runTime * 1000) / 1000])
                        animator(animations,animationSpeed)
                    } else {
                        // NEW Animation System
                        AnimateEngine(["doSim", [resultData]])
                    }

                    break;
                
                default:
                    return ["ERROR", "Unknown Command"]
                    break;
            }

            return ["SUCCESS", "Exectuted Successfully"]

        } catch (error){
            console.error(error)
            return ["ERROR", "Try Failed"]
        }
    
    }

    function resetArray(numOfBars){ // LEGACY - DEPRECATED IN 0.10
        AnimateEngine(["resetArray", numOfBars])
    }
    
    async function animate(command){ // LEGACY - DEPRECATED IN 0.10
        switch(command.command) {
            case 'setColor':
                AnimateEngine(["setColor",command.id,command.color.replace('$BEING_CHECKED', '$CHECKING')])
                break;
            case 'swap':
                AnimateEngine(["swap",parseInt(command.id1),parseInt(command.id2)])
                break;
            case 'setArray':
                AnimateEngine(["setArray",command.array,'$BASE'])
                break;
                
        }
    }

    function animator(animations,speed){ // LEGACY - DEPRECATED IN 0.10
        AnimateEngine(["startAnimation"])
        let idx = 0

        const intervalID = setInterval( () => {
            if (idx > animations.length - 1) {
                clearInterval(intervalID)
                AnimateEngine(["endAnimation"])
                return 
            }
            animate(animations[idx])
            idx++
        }, speed)
    }

    function getNumbersFromArrayState(){
        let numbers = []
        for (let i = 0; i < array.length; i++){
            numbers.push(array[i].value)
        }

        return numbers
    }

    function handleSortClick(){
        if (animationActive) return false
        console.log(AnimateEngine(["executeInternalAnimation", activeAlgorithm]))
    }

    function createBars(){
        let barWidth = ((window.innerWidth / 100) * 90) / numBars

        let barsDivs = array.map((item, idx) => {
            let style = {
                height: `${item.value}%`, 
                backgroundColor: `${item.color}`,
                width: barWidth,
                margin: barWidth / 4 > 20 ? 20 : barWidth / 4,
                fontSize: barWidth > 20 ? barWidth / 3 : 0,
                color: COLORS.TEXT  
            }

            return (<div key={idx} className='bar' style={style}>{item.value}</div>)
        })

        return barsDivs
    }


    return (
        <div className='container'>
            <div className='bar-container'>
                <div className='inner-bar-container'>
                    {createBars()}
                </div>
                
            </div>
            <nav>
            <i className='material-icons consoleButton' onClick={() => setIsTerminalOpen(!isTerminalOpen)}>code</i>
            <div className='sliderBox'>
                <p className={animationActive ? 'disabled' : ''}>Animation Time ({animationSpeed}ms) </p>
                <input disabled={animationActive} type="range" min="1" max="1000" value={animationSpeed} onChange={e => {
                    setAnimationSpeed(parseInt(e.target.value)); 
                }}></input>
            </div>
                <button disabled={animationActive} onClick={() => {if(!animationActive) {resetArray(numBars)}}} className={!animationActive ? 'button reset' : 'button-disabled reset'}>Reset</button>
                <button disabled={animationActive} onClick={handleSortClick} className={!animationActive ? 'button sort' : 'button-disabled sort'}>Sort</button>
                <select disabled={animationActive} value={activeAlgorithm} onChange={e => {setActiveAlgorithm(e.target.value)}}>
                    <option value='bubbleSort'>Bubble Sort</option>
                    <option value='selectionSort'>Selection Sort</option>
                    <option value='insertionSort'>Insertion Sort</option>
                    <option value='quickSort'>Quick Sort</option>
                    <option value='heapSort'>Heap Sort</option>
                    <option value='mergeSort'>Merge Sort</option>
                    <option value='reverseArray'>(Other)Reverse Array</option>
                </select>
                
                    <div className='sliderBox'>
                        <p className={animationActive ? 'disabled' : ''}>Number of Bars ({numBars})</p>
                        <input disabled={animationActive} type="range" min="5" max={`${Math.round(window.innerWidth / 12) - 10}`} value={numBars} onChange={e => {
                            AnimateEngine(["resetArray",parseInt(e.target.value)])
                        }}></input>
                    </div>
                    
                    

                <p title={`Swaps: ${swaps} \nComparisons: ${comparisons}`} className={animationActive ? 'timeTaken disabled' : 'timeTaken'}>{runTime !== 0 ? `Time: ${runTime}ms`: `Time: N/A`}</p>
                
            </nav>
            <InfoCard algorithmType='sorting' algorithmID={activeAlgorithm}/>

            <Console display={isTerminalOpen} AnimateEngine={AnimateEngine}/>
 
        </div>
        
    )
}


export default SortingVisualiser