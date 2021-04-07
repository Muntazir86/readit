const {ipcRenderer} = require('electron')
const itemsJS = require('./items')

let showModel = document.getElementById('show-model'),
    cancelModel = document.getElementById('cancel-model'),
    model = document.getElementById('model'),
    itemURL = document.getElementById('url'),
    addItem = document.getElementById('add-item'),
    items = document.getElementById('items'),
    search = document.getElementById('search')



// show model from menu
ipcRenderer.on('menu-show-model', ()=>{
    showModel.click()
})

// open selected item from menu
ipcRenderer.on('menu-open-item', ()=>{
    itemsJS.open()
})

// deleting selected item from menu
ipcRenderer.on('menu-delete-item', ()=>{
    let selectedItem = itemsJS.getSelectedItem()
    itemsJS.delete(selectedItem.index)
})

// open selected item in native browser
ipcRenderer.on('menu-open-item-native', ()=>{
    itemsJS.openNative()
}) 

// focus search bar from menu
ipcRenderer.on('menu-search-focus', ()=>{
    search.focus()
})

// search items
search.addEventListener('keyup', e=>{
    // noItems.style.display = 'none'
    Array.from( document.getElementsByClassName('read-item')).forEach( item=>{
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})



document.addEventListener('keydown', e=>{
    if(e.key === 'ArrowUp'){
        itemsJS.changeSelection(e.key)
    }
    else if(e.key === 'ArrowDown'){
        itemsJS.changeSelection(e.key)
    }
})


// disable buttons while adding item
const toggleModelButtons = ()=>{
    if(addItem.disabled === true){
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        cancelModel.style.display = 'inline'
    }
    else{
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        cancelModel.style.display = 'none'
    }
}


showModel.addEventListener('click', ()=>{
    model.style.display = 'flex'
    itemURL.focus()
})


cancelModel.addEventListener('click', ()=>{
    model.style.display = 'none'
})

// Handle add url button

addItem.addEventListener('click', ()=>{
    if(itemURL.value){
        // console.log(itemURL.value)
        ipcRenderer.send('add', itemURL.value)
        // window.api.send("add-item", itemURL.value);
        toggleModelButtons()
        
    }
})

ipcRenderer.on('added-success', (e, itemData) =>{
    itemsJS.addItem(itemData, true)
    // console.log(itemData)
    toggleModelButtons()
    itemURL.value = ''
    model.style.display = 'none'
})


// window.api.receive('added-success', itemData => {
//     createItem(itemData, true)
//     console.log(itemData)
//     toggleModelButtons()
//     itemURL.value = ''
//     model.style.display = 'none'
// })

itemURL.addEventListener('keyup', e=>{
    if(e.key === "Enter") addItem.click()
})
