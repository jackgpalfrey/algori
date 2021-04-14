import EventEmitter from "./EventEmitter"


class Clock extends EventEmitter{
    private isLooping: boolean
    private loopSpeed: number
    private currentCycle: number
    private cycleLimit: number
    constructor(){
        super()
        this.isLooping = false
        this.loopSpeed = 1000
        this.currentCycle = 0 
        this.cycleLimit = Infinity
    }

    public completeCycle(){
        if (this.isLooping && this.currentCycle < this.cycleLimit){
            setTimeout(() => {
                this.step()
            }, this.loopSpeed)
        }
    }


    public step(){
        this.emitEvent('step', {currentCycle: this.currentCycle})
        this.currentCycle++
    }

    
    public startLoop(loopSpeed?:number, cycleLimit:number = Infinity){
        if (typeof loopSpeed === 'number') this.loopSpeed = loopSpeed
        this.isLooping = true
        this.completeCycle()

    }


    public stopLoop(){
        this.isLooping = false
    }

}

export default Clock