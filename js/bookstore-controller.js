'use strict'
function onInit() {
    renderBooks()
    renderFilterByQueryStringParams()
}

function renderBooks() {
    var books = getBooks()
    var strHTML = books.map(book => `
    <tr class="book-preview">
    <td class="book-id-${book.id}">${book.id}</td> <td class="book-name-${book.name}">${book.name}</td><td class="book-price-${book.price}">${book.price}</td>
    <td class="read-btn" onclick="onReadBook('${book.id}')"><button>Read</button></td> <td class="update-btn" onclick="onUpdateBook('${book.id}')"><button>Update</button></td> <td class="delete-btn" onclick="onRemoveBook('${book.id}')"><button>Delete</button></td>  
    </tr>`)
    document.querySelector('tbody').innerHTML = strHTML.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()

}

function onUpdateBook(bookId) {
    const book = getBookbyId(bookId)
    var newPrice = +prompt('Price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
    }
}

function onReadBook(bookId) {
    var book = getBookbyId(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = `${book.price} NIS`
    elModal.querySelector('h5').innerHTML = `Book Cover: <img src="${book.imgUrl}" alt="book image">`
    elModal.querySelector('p').innerHTML = `Rating: <button class="rate-down" onclick="onRateBook('${bookId}',-1)">➖</button> <span>${book.rating}</span> <button class="rate-up" onclick="onRateBook('${bookId}',1)">➕</button>`
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')

}

function onAddBook() {
    var name = prompt('Book Name?')
    var price = prompt('Price?')
    if (name) {
        const book = addBook(name, price)
        renderBooks()
    }
}

function onRateBook(bookId, rate) {
    const book = getBookbyId(bookId)
    if ((book.rating <= 10 && rate === -1) || (book.rating >= 0 && rate === 1)) {
        rateBook(bookId, rate)
        var elModal = document.querySelector('.modal')
        elModal.querySelector('p span').innerText = book.rating
        if (book.rating === 10) {
            document.querySelector('.modal p .rate-up').setAttribute('disabled', '')
        }
        else { document.querySelector('.modal p .rate-up').removeAttribute('disabled') }
        if (book.rating === 0) {
            document.querySelector('.modal p .rate-down').setAttribute('disabled', '')
        }
        else { document.querySelector('.modal p .rate-down').removeAttribute('disabled') }
    }
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?name=${filterBy.name}&maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryStringParams.get('name') || '',
        maxPrice: +queryStringParams.get('maxPrice') || 100,
        minRate: +queryStringParams.get('minRate') || 0
    }

    if (!filterBy.name && !filterBy.maxPrice) return

    document.querySelector('.filter-name').value = filterBy.name
    document.querySelector('.filter-price').value = filterBy.maxPrice
    document.querySelector('.filter-rate').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onNextPage() { //buggy
    const page = getCurrPage()
    page.idx++
    const books = getBooks()
    nextPage()
    renderBooks()
    if (page.idx > books.length / page.pageSize) {
        document.querySelector('.next-btn').setAttribute('disabled', '')
    } else {
        document.querySelector('.next-btn').removeAttribute('disabled')
    }

    if(page.idx>0) document.querySelector('.prev-btn').removeAttribute('disabled')
}

function onPrevPage() { //buggy
    const page = getCurrPage()
    page.idx--
    if(page.idx===0) document.querySelector('.prev-btn').setAttribute('disabled', '')
    document.querySelector('.next-btn').removeAttribute('disabled')
    prevPage()
    renderBooks()
}