import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Container from '../components/ChangeLog/Container'
import Item from '../components/ChangeLog/Item'


import changeLogData from '../data/changelogData.json'


function HomePage(){
    const [isAllOpen, setIsAllOpen] = useState(false)
    const [isNewestFirst, setIsNewestFirst] = useState(true)
    console.log(isAllOpen)

    let changeLogItems = changeLogData.slice()
    if (isNewestFirst) changeLogItems = changeLogItems.reverse()

    let changeItems = changeLogItems.map((value, idx) => {
        let dontDisplay = false
        dontDisplay = value.dontDisplay
        if (!dontDisplay) return <Item key={idx}  isOpen={isAllOpen} changes={value.modifications} date={value.isNext ? `Planned for ${value.date}` : value.date} version={value.isNext ? 'Next update' : value.version} title={value.title}> <p>{value.info}</p> </Item>
    
    })



    return (
        <div className='changeLog'>
            <div className='changeLogMenuItems'>
                <div className='openAllChangesButton' onClick={() => setIsAllOpen(!isAllOpen)}>{isAllOpen ? 'Close All' : 'Open All'}</div>
                <div className='openAllChangesButton' onClick={() => setIsNewestFirst(!isNewestFirst)}>{isNewestFirst ? 'Order Oldest to Newest' : 'Order Newest to Oldest'}</div>
            </div>
            <Container titleBgColor='' titleTxtColor='' infoBgColor='' infoTxtColor=''>
                {changeItems}
            </Container>
        </div>

    )
}

export default HomePage