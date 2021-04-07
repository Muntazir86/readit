const { shell } = require('electron')
const fs = require('fs')
const items = document.getElementById('items')

let readerJS
fs.readFile(`${__dirname}/reader.js`, (err,data)=>{
    readerJS = data.toString()
})

//listning for message from reader window
window.addEventListener('message', e=>{

    if(e.data.action === 'delete-reader-item'){
        // console.log(e.data)
        this.delete(e.data.itemIndex)
        e.source.close()
    }
})

// delete item
exports.delete = itemIndex =>{
    items.removeChild( items.childNodes[itemIndex])

    //deleting item from storage
    this.storage.splice(itemIndex, 1)

    this.save()

    //slecting previous item or next item
    if(this.storage.length){
        //get new selected item index
        let = newSelectedItemIndex = (itemIndex === 0) ? 0: itemIndex -1

        //select new item
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}


//getting seleted item index
exports.getSelectedItem = ()=>{
    let currentItem = document.getElementsByClassName('read-item selected')[0]
    
    itemIndex = 0
    let child = currentItem
    while( (child = child.previousElementSibling) != null ) itemIndex ++

    return { node: currentItem, index: itemIndex }
}

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// persist storage
exports.save = ()=>{
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}


// set items as selected
exports.select = e=>{
    this.getSelectedItem().node.classList.remove('selected')
    e.currentTarget.classList.add('selected')
}



// change item selection
exports.changeSelection = direction =>{
    let currentItem = this.getSelectedItem()
    if(direction ==='ArrowUp' &&  currentItem.node.previousElementSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.previousElementSibling.classList.add('selected')
    }
    else if(direction === 'ArrowDown' && currentItem.node.nextElementSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.nextElementSibling.classList.add('selected')
    }
}
// opening item in user's browser
exports.openNative = ()=>{
    if(!this.storage.length) return

    let selectedItem = this.getSelectedItem()

    let contentURL = selectedItem.node.dataset.url

    shell.openExternal(contentURL)
}

// handleing opening of item link
exports.open = ()=>{
    if(!this.storage.length) return

    let selectedItem = this.getSelectedItem()

    let contentURL = selectedItem.node.dataset.url
    
    let renderWin = window.open(contentURL, '', `
    maxWidth: 2000,
    maxHeight: 2000,
    width: 1200,
    height: 800,
    nodeIntegration: 0,
    contextIsolation: 1
    `)

    renderWin.eval(readerJS.replace('{{index}}', selectedItem.index))
}

// Add item 
exports.addItem = (item,newItem = false) => {
    // create a new DOM
    let itemNode = document.createElement('div')
    
    // Assign read-item class
    itemNode.setAttribute('class', 'read-item')

    // assign data url attribute
    itemNode.setAttribute('data-url', item.url)
    // add inner HTML
    itemNode.innerHTML = `<img src = "${item.screenshot}">&#160&#160<h3>${item.title}</h3>`

    items.appendChild(itemNode)

    itemNode.addEventListener('click', e=>{
        this.select(e)
    })

    itemNode.addEventListener('dblclick', e=>{
        this.open()
    })

   if(document.getElementsByClassName('read-item').length === 1){
       itemNode.classList.add('selected')
   } 

    if(newItem){
       this.storage.push(item)
       this.save()
    }
    
}


//adding existing items to storage
this.storage.forEach(element => {
    this.addItem(element)
});
