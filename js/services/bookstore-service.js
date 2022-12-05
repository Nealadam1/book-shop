const STORAGE_KEY = 'bookDB'
const gBookNames = [{name:'book1', img:'img/book1.png'}, {name:'book2' ,img:'img/book2.jpg'}, {name:'book3', img:'img/book3.jpg'}]
const PAGE_SIZE = 5

var gBooks
var gFilterBy = { name: '', maxPrice: 100, minRate:0}
var gPageIdx=0

_createBooks()

function getCurrPage(){
    return page= {idx:gPageIdx,pageSize:PAGE_SIZE}
}

function nextPage(){
    gPageIdx++
    if(gPageIdx*PAGE_SIZE >= gBooks.length){
        gPageIdx=0
    }
}
function prevPage(){
    gPageIdx--
    if(gPageIdx*PAGE_SIZE >= gBooks.length){
        gPageIdx=0
    }
}

function getBooks() {
    var books = gBooks.filter(book => book.name.includes(gFilterBy.name) &&
        book.price <= gFilterBy.maxPrice&& book.rating >= gFilterBy.minRate)
    var startIdx= gPageIdx*PAGE_SIZE
    return books.slice(startIdx,startIdx+PAGE_SIZE)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookId, 1)
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createbook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function rateBook(bookId,rate){
    const book = gBooks.find(book => bookId === book.id)
    book.rating +=rate
    _saveBooksToStorage()
    return book

}

function _createbook(name, price = getRandomIntInclusive(25, 99),imgUrl='img/book0.jpg') {
    return {
        id: makeId(),
        name,
        price,
        imgUrl,
        rating:0
    }
}

function getBookbyId(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        
        for (var i = 0; i < gBookNames.length; i++) {
            const bookidx=getRandomIntInclusive(0, gBookNames.length - 1)
            var name = gBookNames[bookidx].name
            var img = gBookNames[bookidx].img
            books.push(_createbook(name,undefined,img))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setBookFilter(filterBy = {}) {
    gPageIdx=0
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    return gFilterBy
}
