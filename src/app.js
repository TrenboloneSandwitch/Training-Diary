var PHASE;

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
});

// Při otevření modalu ulož kde jsi ho otevřel
$('#addExerciseModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var hiddenVal = button.data('phase')
  PHASE = hiddenVal;
});




// Class init
const ui = new UI();


// Event listeners

document.querySelector('.plus-btn').addEventListener('click', function (e) {
  document.querySelector('#save-exercise-btn').style.display = 'block';
  document.querySelector('#edit-exercise-btn').style.display = 'none';
});

// ADD EXERCISE listener
document.querySelector('#add-series-btn').addEventListener('click', createInputs);

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
    //console.log(e.target.parentNode.parentNode.parentNode);

  };
});



// SUBMIT form listener
document.querySelector('#save-exercise-btn').addEventListener('click', addExercise);

// SUBMIT EDIT
document.querySelector('#edit-exercise-btn').addEventListener('click', editExercise);

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

function addExercise(e) {
  // Rozhodni jestli jde o rozcvičku nebo hlavní část
  let containerID = '';
  if (PHASE === 'warmUP') {
    containerID = 'warmup-exercises-container';

  } else {
    containerID = 'main-exercises-container';
  };

  const reps = [];
  const series = [];
  const weight = [];
  const name = document.querySelector('#exercise-name-input').value;

  // Nejdřív zjisti jestli vyplnil jméno
  if (typeof name !== 'string' || name === '') {
    ui.showAlert('Název cviku není vyplněn!', 'danger', 'times', '#modal-form', '#exercise-row');
  } else {
    // Zjisti počet řádků
    const numberOfRows = ui.getRowsFromModal().length;
    let noEmptyFields = true;
    // Zapiš hodnoty do příslušných řad
    for (let index = 0; index < numberOfRows; index++) {
      series[index] = document.querySelector(`#exercise-series-input-${index + 1}`).value;
      reps[index] = document.querySelector(`#exercise-reps-input-${index + 1}`).value;
      weight[index] = document.querySelector(`#exercise-weight-input-${index + 1}`).value;

      // Podmínka na vyplnění inputů
      if (series[index] === '' || reps[index] === '' || weight[index] === '') {
        ui.showAlert('Vyplňte prosím všechny údaje!', 'danger', 'times', '#modal-form', '#exercise-row');
        noEmptyFields = false;
        break;
      }
    }
    // Pokud je vše v pořádku, můžeš pokračovat
    if (noEmptyFields) {
      ui.showAlert('Cvik byl úspěšně vložen do seznamu!', 'success', 'check', '#modal-form', '#exercise-row')
      // Objekt s příslušnýma hodnotama
      const exercise = {
        name,
        series,
        reps,
        weight
      };


      // Add into UI
      ui.addExerciseIntoUI(exercise, containerID);
      // Add to Storage
      // Back to default state
      ui.removeAllAdditionallRowsFromModal();
    }
  }
  e.preventDefault();
}

function closeModal() {
  ui.removeAllAdditionallRowsFromModal();
}

function removeItem(item) {
  ui.removeExerciseFromUI(item.parentNode);
}

function editExercise(e){
  // něco


  e.preventDefault();
}
function callUpdateItem(row) {
  // ID jestli rozcvička nebo main
  //console.log(row.parentNode.parentNode.id);
  // vyselektuj údaje z daného řádku
  const exrName = row.querySelector('.exr-name').innerText;
  const tables = row.querySelectorAll('table');
  const reps = [];
  const series = [];
  const weight = [];
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


  const exercise = {
    exrName,
    series,
    reps,
    weight
  }
  

  $('#addExerciseModal').modal('show');
  document.querySelector('#save-exercise-btn').style.display = 'none';
  document.querySelector('#edit-exercise-btn').style.display = 'block';

}

