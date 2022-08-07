// define variables in global scope
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// if the endpoint is '/notes', define html elements as variables
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// function that takes a html element as an argument, and then shows that element (display: inline;)
const show = (elem) => {
  elem.style.display = 'inline';
};

// function that takes a html element as an argument, and then hides that element (display: none;)
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// function that creates a fetch GET request to '/api/notes' 
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
});

// function that creates a fetch POST request to '/api/notes'
// takes note object as argument
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // converts the note object argument into JSON so it can be sent by a http request
    body: JSON.stringify(note),
});

// irrelevant for core assessment criteria
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
});

// this function will help to render the active note when a note on the left-hand side is clicked
const renderActiveNote = () => {
  // hide the save button
  hide(saveNoteBtn);

  if (activeNote.id) {
    // if activeNote.id is truthy, execute this code

    // set attribute readonly="true" for the noteTitle element and noteText element
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);

    // set values on the right-hand side
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    // if activeNote.id is falsy, execute this code

    // remove attribute readonly for the noteTitle element and noteText element
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');

    // set values on the right hand side
    noteTitle.value = '';
    noteText.value = '';
  }
};

// function to handle saving note functionality
const handleNoteSave = () => {
  // create new note object
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  // saveNote asynchronously, and when that's done, execute two other functions
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note (not relevant for core assessment criteria)
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// function that displays the note on the left-hand side that was clicked on by the user. Displays it on the right-hand side.
const handleNoteView = (e) => {
  // prevents the default behaviour
  e.preventDefault();

  // go into the html element that the user clicked, get it's parent element, get the parent element's data-note dataset attribute, parse it to create a javascript object, then store that object in a variable
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));

  // render the active note by using this function
  renderActiveNote();

  // set values on the right-hand side
  noteTitle.value = activeNote.title;
  noteText.value = activeNote.text;
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// this function will hide or show the save note button based off a certain condition
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    // if noteTitle.value.trim() is an empty string or noteText.value.trim() is an empty string, the expression above will return true, and therfore, the save button should be hidden 
    hide(saveNoteBtn);
  } else {
    // if !noteTitle.value.trim() || !noteText.value.trim() doesn't return true, then that means something has been written in NoteTitle or Notetext, so the save button should be shown
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// if the endpoint is '/notes', add event listeners to all these html elements
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

// call function to initialise the web page
getAndRenderNotes();

