class UI {
    constructor() {
        this.form = document.querySelector('#modal-form');
        this.span = document.querySelector('#next-inputs');
        this.removeRowBtn = document.querySelector('#remove-series-btn');
    };

    // Add row of inputs into modal
    addRowsIntoModal() {
        // Get last index and + one
        const ID = this.getRowsFromModal().length + 1;
        // Create div and add classes
        const div = document.createElement('div');
        div.classList = 'row mt-2 inputs-row';
        div.dataset.rowID = this.getRowsFromModal().length + 1;
        // Inner HTML
        let html = `<div class="col-4">
            <input class="form-control custom-form-input" type="text" placeholder="" id="exercise-series-input-${ID}">
        </div>
        <div class="col-4">
            <input class="form-control" type="text" placeholder="" id="exercise-reps-input-${ID}">
        </div>
        <div class="col-4"> 
            <input class="form-control" type="text" placeholder="" id="exercise-weight-input-${ID}">
        </div>`;
        div.innerHTML = html;
        // Insert created div on certain position
        //this.form.insertBefore(div, this.span);
        this.form.insertBefore(div, document.querySelector('#modal-form').lastChild.nextSibling);
        this.hideRemoveButton();
        
    }

    // Remove last row from modal form
    removeLastRowFromModal() {
        const inputs = this.getRowsFromModal();
        if (inputs.length > 1) {
            inputs[inputs.length - 1].parentNode.removeChild(inputs[inputs.length - 1]);
            this.hideRemoveButton();
        }
    }
    // Remove all rows except default first one
    removeAllAdditionallRowsFromModal() {
        let divs = document.querySelectorAll('.inputs-row');
        // Convert nodelist into array
        const divsArr = Array.prototype.slice.call(divs);
        // Loop through the all rows of inputs except the first one
        for (let index = 1; index < divsArr.length; index++) {
            // Remove all rows except the first one
            divsArr[index].remove();
        }
        // Clear values from inputs
        this.clearInputs();

        this.hideRemoveButton();
    }
    // Returns node array of all rows
    getRowsFromModal() {
        const inputs = document.querySelectorAll('.inputs-row');
        return inputs;
    }

    // Clear values from all inputs
    clearInputs() {
        // Select every input in the document
        const nodelist = document.querySelectorAll('input');
        // Convert nodearray into array
        const divsArr = Array.prototype.slice.call(nodelist);
        // Loop through and clear all values
        for (let index = 0; index < divsArr.length; index++) {
            divsArr[index].value = '';
        };
    }

    
    // Create exercise based on user inputs and add it into UI
    addExerciseIntoUI(exercise, containerID) {
        const mainDiv = document.querySelector(`#${containerID}`);
        //mainDiv.classList = 'card-body col-12'
        
        if (document.querySelector(`#empty-span-${containerID}`)) {
            mainDiv.innerHTML = '';
        }

        const subDIV = document.createElement('div');
        // tady
        const rowid = mainDiv.querySelectorAll('.row').length;
        // create elements
        const row = document.createElement('div');
        const col1 = document.createElement('div');
        const col2 = document.createElement('div');
        const hr = document.createElement('hr');
        // append classes to the elements
        row.classList = `row text-dark text-center align-items-center`;
        //tady
        row.id = `row-${containerID}-${rowid}`;
        
        col1.classList = 'col-5 col-sm-4 col-md-3';
        col2.classList = 'col-7 col-sm-8 col-md-9 tables';

        col1.innerHTML = `<span class="exr-name">${exercise.name}</span>`;
        col1.appendChild(document.createElement('br'));
        const aData = [
            ['edit', 'warning', 'Upravit záznam', 'pencil'],
            ['remove', 'danger', 'Smazat záznam', 'trash']
        ];
        aData.forEach(item => {
            // Create linj element
            const link = document.createElement('a');
            // Add classes and datasets
            link.classList = `${item[0]} text-${item[1]} mr-2`;
            link.dataset.toggle = 'tooltip';
            link.dataset.placement = 'bottom';
            link.dataset.trigger = 'hover';
            link.style.cursor = 'pointer';
            link.title = `${item[2]}`;
            // add icon
            link.innerHTML = `
                    <i class="fa fa-${item[3]} fa-lg" aria-hidden="true">
                    </i>`;
            // Append to collumn
            col1.appendChild(link);
        });

        //
        col2.innerHTML = this.drawTable(exercise);

        // Append cols to rows
        row.appendChild(col1);
        row.appendChild(col2);
        // Append rows to container
        subDIV.appendChild(row);
        subDIV.appendChild(hr);
        mainDiv.appendChild(subDIV);
    }

    drawTable(exercise){
        let html = '';
        for (let index = 0; index <exercise.reps.length; index++) {
            html += `<table>
            <tbody>
              <tr>
                <th><span class="series">${exercise.series[index]}</span>x<span class="reps">${exercise.reps[index]}</span></th>
              </tr>
              <tr>
                <th><span class="weight">${exercise.weight[index]}</span></th>
              </tr>
            </tbody>
          </table>`;
        }
        return html;
    }

    hideRemoveButton(){
        const inputs = this.getRowsFromModal();

        if (inputs.length === 1) {
            this.removeRowBtn.style.display = 'none';
        } else if (inputs.length !== 1 && (this.removeRowBtn.style.display === 'none')){
            this.removeRowBtn.style.display = 'block';
        }
    }


    // Remove exercise
    removeExerciseFromUI(item) {
        const ID = item.parentNode.id;
        const div = item.parentNode;
        item.remove();
        let nodes = document.querySelector(`#${ID}`).childNodes;
        if (nodes.length === 0) {
            let span = document.createElement('span');
            span.id = 'empty-span-' + ID;
            span.textContent = 'Zatím nebyl přidán žádný cvik.';
            div.appendChild(span);
        }
    }


    // Show alert
    showAlert(msg, cls, icon, begin, end) {
        this.clearAlert();
        const beginNodeUI = document.querySelector(begin);
        const endNodeUI = document.querySelector(end);
        const div = document.createElement('div');
        div.classList = `alert alert-${cls} alert-modal`;
        div.innerHTML = ` <i class="fa fa-${icon}"></i> ${msg}`;
        beginNodeUI.insertBefore(div, endNodeUI);

        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }

    // Clear alert
    clearAlert() {
        const currentAlert = document.querySelector('.alert-modal');
        if (currentAlert) {
            currentAlert.remove();
        }
    }

    changeState(state) {
        if (state == 'save') {
          document.getElementById('save-exercise-btn').style.display = 'block';
          document.getElementById('edit-exercise-btn').style.display = 'none';
          document.getElementById('modal-titleID').innerText = 'Přidat cvik';
        } else {
          document.getElementById('save-exercise-btn').style.display = 'none';
          document.getElementById('edit-exercise-btn').style.display = 'block';
          document.getElementById('modal-titleID').innerText = 'Editovat cvik';
        }
      }
}