import React, { useEffect, useState } from 'react'

import { toBin, toHex, fromBin, fromHex, calculateSigned8BitBinaryValue, addWithCarry, byteAdd} from '../../util/VM/helpers'
import VM from '../../util/VM/CPU'
import INS from '../../util/VM/instructionSet'

const CPU = new VM({cycleLimit: 10, cycleSpeed:1000})


const ComputerVisualiser: React.FC = () => {
    // console.log(byteAdd('11111111', '11111111'))
    // let bin = toBin(fromBin('0111 1111'))
    // console.log(bin[bin.length - 8])
    addWithCarry(200, 10)

    // CPU.loadProgram([   'A9','FF', // LDA IMD
    //                     '85','90',
    //                     '8D','00','80',
    //                     '49','CC',
    //                     '4C','0','0'

    //                 ], 'HEX')


    // CPU.loadProgram([   
    //                     'A9','00', // LDA IMD
    //                     '85','42',
    //                     'E6','42',
    //                     'A6','42',
    //                     'E8'

    //                 ], 'HEX')


    CPU.loadProgram([   
                        'A9','00', // LDA IMD
                        'F0','FC',
                    ], 'HEX')


    
    


    return (
        <div></div>
    )
} 

export default ComputerVisualiser