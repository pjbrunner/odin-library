let myLibrary = [];

function Book(author, title, pages, read, id) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.id = id;
}

function displayModal() {
    modal.style.display = 'flex';
    const submitModal = document.getElementById('submit-modal');

    // Alternate way to get form data, taken from https://www.youtube.com/watch?v=P-jKHhr6YxI
    // let formData = Array.from(document.querySelectorAll('#book-data input')).reduce((accumulator, input) => ({ ...accumulator, [input.id]: input.value }), {});
    submitModal.addEventListener('click', () => {
        addBookToLibrary(formData[0].value, formData[1].value, formData[2].value, formData[3].checked)
    });
}

function addBookToLibrary(author, title, pages, read) {
    if (!isValidString(author) || !isValidString(title) || !isValidNumber(pages)) {
        return;
    }

    let newBook = new Book(author, title, pages, read, sessionStorage.length)
    sessionStorage.setItem(sessionStorage.length, JSON.stringify(newBook));
    myLibrary.push(newBook);
    newBookDiv = createBookDiv(newBook);
    libraryDiv.appendChild(newBookDiv);
    modal.style.display = 'none';
    resetFormData();
}

function sanitizeString(str) {
    // Replace all non-alphanumeric characters with an empty string.
    // https://stackoverflow.com/questions/9311258/how-do-i-replace-special-characters-with-regex-in-javascript
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

function sanitizeNumber(str) {
    return str.replace(/[^-.0-9]/g, '');
}

function isEmpty(str) {
    return (str === null || str === '' || str === undefined) ? true : false;
}

function isValidString(str) {
    if (isEmpty(str) || str.search(/[^a-zA-Z0-9]/g) !== -1) {
        return false;
    }
    return true;
}

function isValidNumber(num) {
    num = Number(num);
    if (isEmpty(num) || !Number.isInteger(num) || num <= 0) {
        return false;
    }
    return true;
}

function cleanSessionStorage() {
    // The VSCode "Live Server" extension automatically adds this to
    // sessionStorage while I was testing this site. It messes things up so
    // I'm manually removing it here.
    sessionStorage.removeItem('IsThisFirstTime_Log_From_LiveServer');
}

function retrieveSessionStorage() {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
        let obj = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
        let book = new Book(obj.author, obj.title, obj.pages, obj.read, obj.id);
        let bookDiv = createBookDiv(book);
        myLibrary.push(book);
        libraryDiv.appendChild(bookDiv);
    }
}

function createBookDiv(book) {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    addInfoToDiv(bookDiv, book.author);
    addInfoToDiv(bookDiv, book.title);
    addInfoToDiv(bookDiv, book.pages + ' pages');

    let readSpan = document.createElement('span');
    let readCheckbox = document.createElement('input');
    readSpan.textContent = 'Read';
    readCheckbox.type = 'checkbox';
    if (book.read) {
        readCheckbox.checked = true;
    } else {
        readCheckbox.checked = false;
    }
    readSpan.appendChild(readCheckbox);
    bookDiv.appendChild(readSpan);
    addBreak(bookDiv);
    addBreak(bookDiv);

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = 'Remove';
    bookDiv.appendChild(removeButton);

    // Change checkbox state in sessionStorage if checkbox changed.
    readCheckbox.addEventListener('click', () => {
        let sessionBook = JSON.parse(sessionStorage.getItem(book.id));
        readCheckbox.checked ? sessionBook.read = true : sessionBook.read = false;
        sessionStorage.setItem(book.id, JSON.stringify(sessionBook));
    });

    removeButton.addEventListener('click', () => {
        libraryDiv.removeChild(bookDiv);
        myLibrary.splice(myLibrary.indexOf(book), 1);
        sessionStorage.removeItem(book.id);
    }); 

    return bookDiv;
}

function resetFormData() {
    formData[0].value = '';
    formData[1].value = '';
    formData[2].value = '';
    formData[3].checked = false;
}

function addInfoToDiv(parentDiv, info) {
    let span = document.createElement('span');
    span.textContent = info;
    parentDiv.appendChild(span);
    addBreak(parentDiv);
}

function addBreak(parentDiv) {
    let br = document.createElement('br');
    parentDiv.appendChild(br);
}

const addBook = document.getElementById('add-book');
const closeModal = document.getElementById('close-modal');
const libraryDiv = document.getElementById('library');
const formData = Array.from(document.querySelectorAll('#book-data input'));

addBook.addEventListener('click', displayModal);
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
    resetFormData();
});

window.addEventListener('click', event => {
    if (event.target == modal){
        modal.style.display = 'none';
        resetFormData();
    }
});

cleanSessionStorage();
window.onload = retrieveSessionStorage();