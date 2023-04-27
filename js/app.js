const formCreate = document.getElementById('form-create')
const formEdit = document.getElementById('form-edit')
const listGroupTodo = document.getElementById('list-group-todo')

const time = document.getElementById('time')
const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')

const fullDay = document.getElementById('full-day')
const hourEl = document.getElementById('hour')
const minuteEl = document.getElementById('minute')
const secondEl = document.getElementById('second')
const closeEl = document.getElementById('close')


let todos = JSON.parse(localStorage.getItem('list')) ? JSON.parse(localStorage.getItem('list')) : []
let editItemId

if (todos.length) showTodos()

function setTodos() {
    localStorage.setItem('list', JSON.stringify(todos))
}

fullDay.textContent = `
    ${moment().format("DD MMMM YYYY")}
`

function getTime() {
    hourEl.textContent = moment().format("hh")
    minuteEl.textContent = moment().format("mm")
    secondEl.textContent = moment().format("ss")
}

setInterval(getTime, 1000)


function showTodos() {
    const todos = JSON.parse(localStorage.getItem('list'))
    listGroupTodo.innerHTML = ''
    todos.forEach((item, i) => {
        listGroupTodo.innerHTML += `
            <li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between fs-4 ${item.completed == true ? 'complated': ''}">
                ${item.text}
                <div class="todo-icons">
                <span class="opacity-50 me-2 timeClass">${item.time}</span>
                <img onclick="editTodo(${i})" src="./img/edit.svg" alt="" width="25" height="25">
                <img onclick="deleteTodo(${i})" src="./img/delete.svg" alt="" width="25" height="25">
                </div>
            </li>
        `
    });
}


function showMessage(where, message) {
    document.getElementById(`${where}`).textContent = message
    document.getElementById(`${where}`).classList.remove('d-none')

    setTimeout(() => {
        document.getElementById(`${where}`).classList.add('d-none')
    }, 2500)
}

formCreate.addEventListener("submit", (e) => {
    e.preventDefault()
    const todoText = formCreate['input-create'].value.trim()
    formCreate.reset()
    if (todoText.length) {
        todos.push({ text: todoText, time: moment().format("hh:mm, DD MMM YYYY"), completed: false })
        setTodos()
        showTodos()
    } else {
        showMessage('message-create', "Enter some todo...")
    }
})

formEdit.addEventListener('submit', (e) => {
    e.preventDefault()

    const todoText = formEdit['input-edit'].value.trim()
    formEdit.reset()
    if (todoText.length) {
        todos.splice(editItemId, 1 , { text: todoText, time: moment().format("hh:mm, DD MMM YYYY"), completed: false })
        setTodos()
        showTodos()
        close()
    } else {
        showMessage('message-edit', "Enter some todo...")
    }
})

function deleteTodo(index) {
    const deletedTodos = todos.filter((item, i) => i !== index)
    todos = deletedTodos
    setTodos()
    showTodos()
}


function setCompleted(index) {
    const completedTodos = todos.map((item, i) => {
        if(i == index) {
            return {...item, completed: item.completed == true ? false : true}
        } else {
            return {...item}
        }
    })
    todos = completedTodos
    setTodos()
    showTodos()
}


function editTodo(index) {
    open()
    editItemId = index
}

function open() {
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
}

function close() {
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
}

overlay.addEventListener('click', close)
closeEl.addEventListener('click', close)
document.addEventListener('keydown', (e) => {
    if(e.key == 'Escape') {
        close()
    }
})
