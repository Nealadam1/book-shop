var gTrans={
    title:{
        en: 'Welcome to my Bookshop',
        he: 'ברוכים הבאים לחנות הספרים'
    },
    'filter-name':{
        en: 'Filter Book by Name',
        he: 'סנן על פי שם'
    },
    'filter-max-price':{
        en: 'Max Price:',
        he: 'מחיר מקסימלי:'
    },
    'filter-min-rate':{
        en: 'Min rate:',
        he: 'דירוג מינמאלי:'
    },
    'new-book':{
        en: 'Create New Book',
        he: 'הוסף ספר חדש'
    },
    'table-id':{
        en: 'Id',
        he: 'מזהה פריט'
    },
    'table-title':{
        en: 'Title',
        he: 'שם פריט'
    },
    'table-price':{
        en: 'Price',
        he: 'מחיר'
    },
    'table-actions':{
        en: 'Actions',
        he: 'פעולות'
    },
    'modal-price':{
        en: 'Price:',
        he: 'מחיר:'
    },
    'modal-rating':{
        en: 'Rating:',
        he: 'דירוג:'
    },
    'modal-cover':{
        en: 'Book Cover:',
        he: 'עטיפת הספר:'
    },
    'next-page':{
        en: 'Next Page',
        he: 'עמוד הבא'
    },
    'prev-page':{
        en: 'Prev Page',
        he: 'עמוד קודם'
    },
    'btn-read':{
        en:'Read',
        he:'קרא'
    },
    'btn-update':{
        en:'Update',
        he:'עדכן'
    },
    'btn-delete':{
        en:'Delete',
        he:'מחק'
    }
   


}

var gCurrLang='en'

function getTrans(transkey){
    const key=gTrans[transkey]
    if(!key) return 'unknown'

    var translation=key[gCurrLang]
    if(!translation) translation=key.en
    return translation

}

function doTrans(){
    var els=document.querySelectorAll('[data-trans]')
    els.forEach(el=>{
        const transkey=el.dataset.trans
        const translation=getTrans(transkey)

        el.innerText=translation
        if(el.placeholder) el.placeholder=translation
    })
}

function setLang(lang){
    gCurrLang=lang
}