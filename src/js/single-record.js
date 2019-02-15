/**
 * Class Init
 */
const ui = new UI();
const LS = new LocalStorage();
const storage = new Storage1();

/**
 * Global Vars using module revealling pattern
 */
var mySingleGlobalVar = (function () {
  var PHASE;
  var row;

  function setPhase(myvar1) {
    PHASE = myvar1;
  }

  function setRow(myvar2) {
    row = myvar2;
  }

  function getPhase() {
    return PHASE;
  }

  function getRow() {
    return row;
  }

  return {
    setPhase: setPhase,
    setRow: setRow,
    getPhase: getPhase,
    getRow: getRow
  }
})();

/**
 * IIFE for tooltip init an modal init
 */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
});

/**
 * After opennig modal, say where did you open it
 */
$('#addExerciseModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var hiddenVal = button.data('phase')
  mySingleGlobalVar.setPhase(hiddenVal);
});



/**
 * EVENT LISTENERS
 */

// Select all PLUS icons
const plusBtns = document.querySelectorAll('.phase-title');
// For all plus icons add Event Listener onClick
for (let i = 0; i < plusBtns.length; i++) {
  plusBtns[i].addEventListener("click", function (e) {
    // Change modal state on SAVE
    ui.changeState('save');
    e.preventDefault();
  });
}

// ADD rows into modal listener
document.querySelector('#add-series-btn').addEventListener('click', createInputs);
// Remove row from modal
document.querySelector('#remove-series-btn').addEventListener('click', removeLastRowFromModal);
// REMOVE item listener
document.querySelector('#container-for-exercises').addEventListener('click', e => {
  if (e.target.parentNode.classList.contains('remove')) {
    removeItem(e.target.parentNode.parentNode.parentNode);
  };
});
// EDIT item listener
document.querySelector('#container-for-exercises').addEventListener('click', e => {
  if (e.target.parentNode.classList.contains('edit')) {
    callUpdateItem(e.target.parentNode.parentNode.parentNode);
  };
});

// SUBMIT form listener
document.querySelector('#save-exercise-btn').addEventListener('click', addExercise);

// CLOSE MODAL listener
document.querySelector('.modal').addEventListener('click', e => {
  // Close modal if you click 'X' or 'Zavřít'  
  if (e.target.classList.contains('close-modal')) {

    closeModal();
  }
  e.preventDefault();
});

document.querySelector('#saveDayBTN').addEventListener('click', saveDay);
/*************************************************************/

// Add Inputs into modal
function createInputs(e) {
  ui.addRowsIntoModal();
  e.preventDefault();
}

function removeLastRowFromModal(e) {
  ui.removeLastRowFromModal();
}

function validateExercise(exerciseObject) {
  let noEmptyFields = true;
  if (document.querySelector('#exercise-name-input').value === '') {
    ui.showAlert('Název cviku není vyplněn!', 'danger', 'times', '#modal-form', '#exercise-row');
    noEmptyFields = false
    return {
      noEmptyFields
    };
  } else {
    // Zjisti počet řádků
    const numberOfRows = ui.getRowsFromModal().length;


    // Zapiš hodnoty do příslušných řad
    for (let index = 0; index < numberOfRows; index++) {
      exerciseObject.series[index] = document.querySelector(`#exercise-series-input-${index + 1}`).value;
      exerciseObject.reps[index] = document.querySelector(`#exercise-reps-input-${index + 1}`).value;
      exerciseObject.weight[index] = document.querySelector(`#exercise-weight-input-${index + 1}`).value;

      // Podmínka na vyplnění inputů
      if (exerciseObject.series[index] === '' || exerciseObject.reps[index] === '' || exerciseObject.weight[index] === '') {
        ui.showAlert('Vyplňte prosím všechny údaje!', 'danger', 'times', '#modal-form', '#exercise-row');
        noEmptyFields = false;
        break;
      }
    }
    return {
      noEmptyFields,
      exerciseObject
    };
    // Pokud je vše v pořádku, můžeš pokračovat

  }
}

function addExercise(e) {
  // Rozhodni jestli jde o rozcvičku nebo hlavní část
  let containerID = '';
  if (mySingleGlobalVar.getPhase() === 'warmUP') {
    containerID = 'warmup-exercises-container';
  } else {
    containerID = 'main-exercises-container';
  };
  // Object init
  const reps = [];
  const series = [];
  const weight = [];
  const name = document.querySelector('#exercise-name-input').value;

  let exercise = {
    name,
    reps,
    series,
    weight
  };

  let response = validateExercise(exercise);

  if (response.noEmptyFields) {
    ui.showAlert('Cvik byl úspěšně vložen do seznamu!', 'success', 'check', '#modal-form', '#exercise-row')
    // Objekt s příslušnýma hodnotama
    exercise = response.exerciseObject;
    // Add into UI
    ui.addExerciseIntoUI(exercise, containerID);
    // Add to Storage
    // Back to default state
    ui.removeAllAdditionallRowsFromModal();
  }

  // metoda na validaci DOD2LAT
  // Nejdřív zjisti jestli vyplnil jméno
  e.preventDefault();
}

function closeModal() {
  ui.removeAllAdditionallRowsFromModal();
}

function removeItem(item) {
  ui.removeExerciseFromUI(item.parentNode);
}


function getSingleExercise(row, i) {
  const reps = [];
  const series = [];
  const weight = [];
  const exercise = {};
  const name = row.querySelector('.exr-name').innerText;
  tables = row.querySelectorAll('table');
  tables.forEach((table, y) => {
    reps[y] = parseInt(table.querySelector('.reps').innerText);
    series[y] = parseInt(table.querySelector('.series').innerText);
    weight[y] = parseInt(table.querySelector('.weight').innerText);
  });

  exercise[i] = {
    name,
    reps,
    series,
    weight
  };
  return exercise[i];

}

function getAllExercisesData(container) {
  let warmup = [];
  let partName;

  if (container == 'warmup') {
    partName = 'warmup-exercises-container';
  } else {
    partName = 'main-exercises-container';
  }

  const wu = document.getElementById(`${partName}`);
  const rowsNode = wu.querySelectorAll('.row');

  rowsNode.forEach((row, index) => {
    warmup.push(getSingleExercise(row, index));
  });
  return warmup;

}



function callUpdateItem(row) {
  ui.changeState('edit');
  const rowID = row.id;
  // ID jestli rozcvička nebo main
  //console.log(row.parentNode.parentNode.id);
  // vyselektuj údaje z daného řádku

  const currentRow = document.getElementById(`${rowID}`);
  mySingleGlobalVar.setRow(currentRow);
  let tables = currentRow.querySelectorAll('table');

  let object = getSingleExercise(currentRow)

  // V modalu udělej požadovaný počet řádků
  for (let index = 1; index < tables.length; index++) {
    ui.addRowsIntoModal();
  }
  // Vyplň všechny inputy v modalu
  document.querySelector(`#exercise-name-input`).value = object.name;
  for (let i = 0; i < tables.length; i++) {
    document.querySelector(`#exercise-series-input-${i + 1}`).value = object.series[i];
    document.querySelector(`#exercise-reps-input-${i + 1}`).value = object.reps[i];
    document.querySelector(`#exercise-weight-input-${i + 1}`).value = object.weight[i];
  };

  // Ulož změněné hodnoty po požadovaný cvik
  // vymaž řádky
  //vyčisti pole

  $('#addExerciseModal').modal('show');

}

function editExercise() {
  const currentRow = mySingleGlobalVar.getRow();
  const exrName = document.querySelector('#exercise-name-input').value;
  const reps = [];
  const series = [];
  const weight = [];
  let exercise = {
    exrName,
    reps,
    series,
    weight
  };
  let response = validateExercise(exercise);

  if (response.noEmptyFields) {
    ui.showAlert('Cvik byl úspěšně editován!', 'success', 'check', '#modal-form', '#exercise-row')
    // Objekt s příslušnýma hodnotama
    exercise = response.exerciseObject;
    // Add into UI
    currentRow.querySelector('.exr-name').innerText = exercise.exrName;
    // Add to Storage
    currentRow.childNodes[1].innerHTML = ui.drawTable(exercise);
  }
}


// SUBMIT EDIT
document.querySelector('#edit-exercise-btn').addEventListener('click', function (e) {
  editExercise();
});


function saveDay(e) {
  const id = document.getElementById('basic-info-date').value;
  const name = document.getElementById('basic-info-title').value;
  const difficulty = document.getElementById('basic-info-difficulty').value;
  const notes = document.getElementById('basic-info-notes').value;

  const warmup = getAllExercisesData('warmup');
  const main = getAllExercisesData('main');

  const trenink = {
    id,
    name,
    difficulty,
    notes,
    warmup,
    main
  };

  console.log(trenink);

  // save to LS
  // LS.addItem(trenink, id);
  storage.create(trenink);
  e.preventDefault();
}