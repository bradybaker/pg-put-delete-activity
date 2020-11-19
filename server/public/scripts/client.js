$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});


function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook)
  $('#bookShelf').on('click', '.readBtn', markedAsRead)
  // TODO - Add code for edit & delete buttons
}
function markedAsRead(book) {
  let bookId = $(this).closest('tr').data('id');
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    data: book.status
  }).then(function (response) {
    refreshBooks();
  }).catch(function (error) {
    console.log('error in client PUT', error);
    alert('OPE')
  })
}

function deleteBook() {
  console.log('Delete is working');
  let bookId = $(this).closest('tr').data('id');
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then((function (response) {
    refreshBooks();
  })).catch((function (error) {
    console.log('Error:', error)
    alert('Ope this aint it');
  }))
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  book.status = "Want To Read"
  addBook(book);
  markedAsRead(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr data-id="${book.id}"></tr>`);
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class="readBtn">Mark As Read</button></td>`);
    $tr.append(`<td><button class="deleteBtn">Delete</button></td>`);
    $('#bookShelf').append($tr);
  }
}
