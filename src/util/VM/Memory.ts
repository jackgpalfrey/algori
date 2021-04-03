import { toBin, toHex, fromBin, fromHex } from './helpers'

class Memory{
    public writeable: boolean;
    public dataSize: number;
    public addressSpaceSize: number;
    public maxIntValue: number;
    public data: number[];

    public writes: number;
    public reads: number;

    constructor (dataBitSize: number, addressSpaceSize: number, writeable: boolean = true){
        this.writeable = writeable
        this.dataSize= dataBitSize
        this.addressSpaceSize = addressSpaceSize
        this.maxIntValue = 2**dataBitSize
        this.data = []
        this.writes = 0
        this.reads = 0

        this.reset()

    }


    public reset(){
        this.wipeMemory()
        this.writes = 0
        this.reads = 0
    }

    public wipeMemory(){
        let newArray: number[] = []

        for (let i = 0; i < this.addressSpaceSize; i++){
            newArray.push(0)
        }

        this.data = newArray

        if (this.data.length !== this.addressSpaceSize){
            let error = new Error('Array Inconsistency')
            throw error
        }
    }



    public writeByte(address: number, newIntValue: number){
        if (!this.writeable) throw new Error('Cannot write to ROM')
        if (typeof address !== 'number' || address >= this.addressSpaceSize || address < 0){
            console.log("ERR")
            let error = new Error('Out Of Address Space')
            throw error
        }

        if (typeof newIntValue !== 'number' || newIntValue > this.maxIntValue || newIntValue < 0){
            let error = new Error('Invalid Value')
            throw error
        }

        this.data[address] = newIntValue
        return this.data[address]

    }

    public readByte(address: number){
        if (typeof address !== 'number' || address >= this.addressSpaceSize || address < 0 ){
            let error = new Error('Out Of Address Space')
            throw error
        }

        return this.data[address]

    }

    public readRegion(startAddress: number, endAddress: number){
        if (typeof startAddress !== 'number' || startAddress >= this.addressSpaceSize || startAddress < 0 ){
            let error = new Error(`Out Of Address Space (${startAddress})`)
            throw error
        }
        if (typeof endAddress !== 'number' || endAddress >= this.addressSpaceSize || endAddress < 0){
            let error = new Error(`Out Of Address Space ${endAddress}`)
            throw error
        }

        return this.data.slice(startAddress, endAddress)
    }

}


export default Memory