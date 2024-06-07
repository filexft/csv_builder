input_value = document.getElementById("input_value");
input_btn = document.getElementById("input_btn");
input_btn_update = document.getElementById("input_btn_update");

column_radio = document.getElementById("column_radio");
value_radio = document.getElementById("value_radio");

current_col = document.querySelector("#current_column");

left_column_values = document.querySelector("#column_values_list");

options = {};

current_column = null;

input_btn.addEventListener("click", function () {
  input_type = document.querySelector(
    'input[name="column_value_choice"]:checked'
  );

  if (input_type && input_value.value.trim()) {
    let choice = input_type.value;
    let value = input_value.value;
    // create a column option with empty list
    if (choice == "column") {
      if (options[value]) {
        alert("Column change to existant column" + value);
      } else {
        options[value] = [];
      }
      current_col.innerText = value;
      current_column = value;
      input_value.value = "";
      value_radio.checked = true;
      update_left_column_valu(value);
      // alert("options : " + JSON.stringify(options));
    }
    // add to column option list
    else if (choice == "value") {
      if (!current_column) {
        alert("Please select a first column");
      } else {
        options[current_column].push(value);
        update_left_column_valu();
        // alert("options : " + JSON.stringify(options));
      }
      input_value.value = "";
    } else {
      alert("Please select a type (column or value) and enter a value!");
    }
  } else {
    alert("Please fill select a type (column or value) and enter a value!");
  }
});

function update_left_column_valu(column_name = null) {
  if (!column_name) {
    column_name = current_column;
  }
  left_column_values.innerHTML = "";
  for (let value of options[column_name]) {
    left_column_values.innerHTML += `<li>
        <div class="left_single_value">
            <p>${value}</p>
            <div class="controls">
                <button class="edit" onclick="edit_column_value('${column_name}','${value}')">edit</button>
                <button class="delete" onclick="delete_column_value('${column_name}','${value}')">delete</button>
            </div>
        </div>
    </li>`;
  }
  update_right_column_value();
}

old_value = null;
input_btn_update.addEventListener("click", function () {
  if (input_value.value != old_value) {
    value_idx = options[current_column].indexOf(old_value);
    options[current_column][value_idx] = input_value.value;
    update_left_column_valu(current_column);
    toggel_add();
  } else {
    update_left_column_valu(current_column);
    toggel_add();
  }
  input_value.value = "";
});

function delete_column_value(column_name, value) {
  options[column_name] = options[column_name].filter((item) => item !== value);
  update_left_column_valu(column_name);
}

function edit_column_value(column_name, value) {
  current_column = column_name;
  current_col.innerText = column_name;
  old_value = value;
  input_value.value = value;
  value_radio.checked = true;
  toggel_update();
}

function toggel_update() {
  input_btn_update.style.display = "block";
  input_btn.style.display = "none";
}

function toggel_add() {
  input_btn_update.style.display = "none";
  input_btn.style.display = "block";
}

//  ------ Right Part -----

right_column_list = document.querySelector(".column_list");

function update_right_column_value() {
  if (!isEmpty(options)) {
    right_column_list.innerHTML = "";
    for (let op in options) {
      selection_values = "";
      for (let value of options[op]) {
        selection_values += `<option value="${value}">${value}</option>`;
      }
      right_column_list.innerHTML += `
            <div class="single_column">
            <p>${op}</p>
            <select name="single_column_values">
                ${selection_values}
            </select>
            <div class="controls">
                <button class="edit" onclick="edit_right_column_list('${op}')">edit</button>
                <button class="delete" onclick="delete_option('${op}')">delete</button>
            </div>
        </div>
        `;
    }
  }
}

function edit_right_column_list(column_name) {
  current_column = column_name;
  current_col.innerText = column_name;
  value_radio.checked = true;
  update_left_column_valu(column_name);
}

function delete_option(option) {
  if (options[option]) {
    delete options[option];
    update_right_column_value();
    reset();
  }
}

function reset() {
  column_radio.checked = true;
  current_column = null;
  current_col.innerText = "Column";
  input_value.value = "";
  left_column_values.innerHTML = "";
}

load_btn = document.getElementById("load_csv");

load_btn.addEventListener("click", function () {
  if (!isEmpty(options)) {
    prodct_values_list = arrayProduct(Object.values(options))
    update_product_list(prodct_values_list);
  } else {
    alert("Please add a column");
  }
});

product_list = document.querySelector(".cart_product");

prodct_values_list = [];


download_btn = document.getElementById("download_csv");

download_btn.addEventListener("click", function () {
  if (prodct_values_list.length > 0) {
    download_file(prodct_values_list);
  } else {
    alert("Please add a column");
  }
});

function download_file(rows){

  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach(function(rowArray) {
    let row = rowArray.join(";");
    csvContent += row + "\r\n";
  });


  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "product.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
}



function update_product_list(prodct_values) {
  product_list.innerHTML = "";

  for (let prod of prodct_values) {
    values_list = "";
    for (let item of prod) {
      values_list += `<li>
            ${item}
        </li>`;
    }
    product_list.innerHTML += `<div class="single_prod">
      <ul class="single_prod_values">
          ${values_list}
      </ul>
      <button class="delete_prod" onclick="delete_product('${prod}')">delete</button>
  </div>`;
  }
}


function delete_product(prod) {
  prodct_values_list = prodct_values_list.filter((item) => item != prod);
  update_product_list(prodct_values_list);
}



function arrayProduct(...arrays) {
  return arrays[0].reduce(
    (prevAccumulator, currentArray) => {
      let newAccumulator = [];
      prevAccumulator.forEach((prevAccumulatorArray) => {
        currentArray.forEach((currentValue) => {
          newAccumulator.push(prevAccumulatorArray.concat(currentValue));
        });
      });
      return newAccumulator;
    },
    [[]]
  );
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
