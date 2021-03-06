import React, { useState } from 'react'
import './style.css'
import icon from '../../images/icon.png'
import docData from '../../data/docs'


    

function DocsPage(){
    const [openItem, setOpenItem] = useState("AnimateEngineSort-setState")

    let itemKey = openItem.split('-')
    let data = docData[itemKey[0]].pages[itemKey[1]]

    function createRows(){
        let table = []
    
        for (let i = 0; i < data.arguments.length; i++){
            let arg = data.arguments[i]
            let argRow = []
            argRow.push(<td>{arg[0]}</td>)
            argRow.push(<td>{arg[1]}</td>)
            argRow.push(<td>{arg[2]}</td>)
            argRow.push(<td>{arg[3]}</td>)
    
            table.push(<tr>{argRow}</tr>)
        }
    
        return table
    }


    function createSideBar(){
        let sections = Object.values(docData)
        let sideBarHTML = sections.map((value, index) => {
            let pages = Object.values(value.pages)
            let items = pages.map((pageObj) => {
                let activeItemKey = openItem.split('-')
                let classes = "docsPage-sideBarItem"
                if (value.id === activeItemKey[0] && pageObj.id === activeItemKey[1]) classes += " docsPage-sideBarItem-selected"
                return (<div onClick={() => {
                    setOpenItem(`${value.id}-${pageObj.id}`)
                }} className={classes}>{pageObj.sideTitle}</div>)
            })
            return (
                <div className= 'docsPage-sidebar-section'>
                    <div className="docsPage-sideBarTitle">{value.name}</div>
                    {items}
                </div>
            )
        })

        return [sideBarHTML]
    }

    return (
        <div className='docsPage-container'>
            <div className='docsPage-titleBar'><img className='docspage-img' src={icon} alt='AlgoV' width='80' height='40'/> Documentation</div>
            <div className='docsPage-searchBox'>Test</div>
            <div className='docsPage-mainContent'>
                <div className='docsPage-mainContent-container'>
                    <h1 className='docsPage-mainContent-h1'>{data.title}</h1>
                    <hr />
                    <p className='docsPage-mainContent-description'>{data.desc}</p>
                    <br />
                    <p className='docsPage-mainContent-example-title docsPage-mainContent-example-container'>Syntax: <span className='docsPage-mainContent-example' >{data.syntaxHTML}</span></p>
                    <p className='docsPage-mainContent-example-container'><span className='docsPage-mainContent-example-title'>Example: </span><span className='docsPage-mainContent-example'>{data.exampleHTML}</span></p>
                    <table className='arguments'>
                        <tr>
                            <th>Argument</th>
                            <th>Type</th>
                            <th>Examples</th>
                            <th>Notes</th>
                        </tr>
                        {createRows()}
                    </table>
                </div>
                
            </div>
            <div className='docsPage-sideBar'>
                <div className= 'docsPage-sidebar-container'>
                    {[createSideBar()]}
                </div>
            </div>
        </div>
    )
}

export default DocsPage