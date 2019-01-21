/**
 * Class Init
 */
const ui = new UI();

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
  plusBtns[i].addEventListener("click", function () {
    // Change modal state on SAVE
    ui.changeState('save');
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





function callUpdateItem(row) {
  ui.changeState('edit');
  const rowID = row.id;
  // ID jestli rozcvička nebo main
  //console.log(row.parentNode.parentNode.id);
  // vyselektuj údaje z daného řádku

  const currentRow = document.getElementById(`${rowID}`);
  mySingleGlobalVar.setRow(currentRow);

  const exrName = currentRow.querySelector('.exr-name').innerText;
  const reps = [];
  const series = [];
  const weight = [];

  let tables = '';
  tables = currentRow.querySelectorAll('table');
  
  // Napln objekt datama
  const tablesArr = Array.prototype.slice.call(tables);
  tablesArr.forEach((table, i) => {
    series[i] = parseInt(table.querySelector('.series').innerText);
    reps[i] = parseInt(table.querySelector('.reps').innerText);
    weight[i] = parseInt(table.querySelector('.weight').innerText);
  });

  // V modalu udělej požadovaný počet řádků
  for (let index = 1; index < tablesArr.length; index++) {
    ui.addRowsIntoModal();
  }
  // Vyplň všechny inputy v modalu
  document.querySelector(`#exercise-name-input`).value = exrName;
  tablesArr.forEach((table, i) => {
    document.querySelector(`#exercise-series-input-${i+1}`).value = series[i];
    document.querySelector(`#exercise-reps-input-${i+1}`).value = reps[i];
    document.querySelector(`#exercise-weight-input-${i+1}`).value = weight[i];
  });

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