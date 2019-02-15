const uiSingleRecord = new UI();

class UI_Summary {

    fillList(data) {
        const list = document.querySelector('#workouts-list');
        // Iterate throuht the object
        let html = '';
        for (const key of Object.keys(data)) {
            html += `
                <a class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="collapsed" id="headingTwo-${key}" data-toggle="collapse" data-target="#collapseTwo-${key}" aria-expanded="false" aria-controls="collapseTwo-${key}">
                        <h5 class="font-bolder">${data[key].name}</h5>
                        <div class="d-flex w-100 justify-content-between">
                            <p class="m-0 font-italic">${data[key].difficulty}</p> 
                            <div>
                                <i class="fas fa-edit fa-2x text-warning" title="Editovat"></i>
                                <i class="fas fa-trash fa-2x text-danger delete" title="Smazat"></i>
                            </div>
                        </div>
                        <p class="m-0">${key}</p>
                    </div>
                    <div id="collapseTwo-${key}" class="collapse" aria-labelledby="headingTwo-${key}" data-parent="#workouts-list">
                        <div class="card-body row">
                            <div class="col-12 col-md-6">
                                <h5>Rozvička</h5>
                                <div id="infobody-warmup-${key}" class="row">
                                </div>
                            </div>

                            
                            <div class="col-12 col-md-6">
                                <h5>Hlavní část</h5>
                                <div id="infobody-main-${key}" class="row">
                                </div>
                            </div>
                            <div class="col-12 card card-header mt-2 p-1">Poznámky: ${data[key].notes}</div>

                            
                        </div>
                        </div>
                    </div>
                </a>`;

               
        }

        list.innerHTML = html;

        
        
        // Prochází skrz data, každý záznam zvlášt
        for (const key of Object.keys(data)) {
            
            if('warmup' in data[key]){
                this.fillWithExercises(data[key].warmup, key, 'warmup');                
            } else {
                document.querySelector(`#infobody-warmup-${key}`).innerHTML = '<div class="col-12 mb-3 text-danger">neobsahuje žádné cviky</div>';
            }
            if('main' in data[key]){
                this.fillWithExercises(data[key].main, key, 'main'); 
            } else {
                document.querySelector(`#infobody-main-${key}`).innerHTML = '<div class="col-12 mb-3 text-danger">neobsahuje žádné cviky</div>';
            }
            
        }

         
        
    }

    fillWithExercises(data, key, cls){

        console.log(data);
        

        data.forEach(exr => {
            console.log(exr);
            const col1 = document.createElement('div');
            col1.classList = 'col-3';
            col1.innerHTML = exr.name;

            const col2 = document.createElement('div');
            col2.classList = 'col-9';
            col2.innerHTML = uiSingleRecord.drawTable(exr);


            
            document.querySelector(`#infobody-${cls}-${key}`).appendChild(col1);
            document.querySelector(`#infobody-${cls}-${key}`).appendChild(col2);
        });

    }

    removeSingleRecord(item) {
        item.remove();
    }

    toggleEmptyInformationSpan(id) {
        const emptyInfo = document.querySelector(`#empty-span-${id}`);

        if (document.getElementById(id).getElementsByTagName('a')[0]) {
            // Hide empty span
            emptyInfo.style.display = 'none';
        } else {
            emptyInfo.style.display = 'block';
        }
    }
}