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
    <td class="bg-dark"><button class="read-btn btn btn-primary" data-trans="btn-read" onclick="onReadBook('${book.id}')">Read</button></td> <td class="bg-dark" ><button class="update-btn btn btn-warning" data-trans="btn-update" onclick="onUpdateBook('${book.id}')">Update</button></td> <td class="bg-dark" ><button class="delete-btn btn btn-danger" data-trans="btn-delete" onclick="onRemoveBook('${book.id}')">Delete</button></td>  
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
    var elModal = document.querySelector('.modal-book')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4').innerText = `Price:${book.price}`
    elModal.querySelector('h5').innerHTML = `<img class="book-img" src="${book.imgUrl}" alt="book image">`
    elModal.querySelector('h6').innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    elModal.querySelector('p.rating').innerHTML = `<button class="btn btn-outline-danger rate-down" onclick="onRateBook('${bookId}',-1)">➖</button> <span>${book.rating}</span> <button class="rate-up btn btn-outline-success" onclick="onRateBook('${bookId}',1)">➕</button>`
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal-book').classList.remove('open')

}

function onAddBook() {
    var name = prompt('Book Name?')
    var price = prompt('Price?')
    if (name) {
        const book = addBook(name, price)
        renderBooks()
        doTrans()
    }
}

function onRateBook(bookId, rate) {
    const book = getBookbyId(bookId)
    if ((book.rating <= 10 && rate === -1) || (book.rating >= 0 && rate === 1)) {
        rateBook(bookId, rate)
        var elModal = document.querySelector('.modal-book')
        elModal.querySelector('p span').innerText = book.rating
        if (book.rating === 10) {
            document.querySelector('.modal-book p .rate-up').setAttribute('disabled', '')
        }
        else { document.querySelector('.modal-book p .rate-up').removeAttribute('disabled') }
        if (book.rating === 0) {
            document.querySelector('.modal-book p .rate-down').setAttribute('disabled', '')
        }
        else { document.querySelector('.modal-book p .rate-down').removeAttribute('disabled') }
    }
}

function onSetFilterBy(filterBy,ev) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?lang=${gCurrLang}&name=${filterBy.name}&maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        language:queryStringParams.get('lang')||'en',
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
    doTrans()
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
    doTrans()
}

function onSetLang(lang){
    setLang(lang)
    if(lang==='he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    
    doTrans()
    
}