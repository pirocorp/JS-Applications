import { html, render } from './node_modules/lit-html/lit-html.js';

const root = document.querySelector('tbody');
const input = document.getElementById('searchField');
const searchButtonElement = document.getElementById('searchBtn');
searchButtonElement.addEventListener('click', onSearchButtonClickHandler);

const studentRow = (student) => html`
<tr class="${student.match ? 'select' : ''}">
      <td>${student.item.firstName} ${student.item.lastName}</td>
      <td>${student.item.email}</td>
      <td>${student.item.course}</td>
</tr>`;

const students = await start();
update(students);

function update(students) {
   render(students.map(studentRow), root);
};

async function start() {
   const response = await fetch('http://localhost:3030/jsonstore/advanced/table');
   const data = await response.json();
   const students = Object.values(data).map(s => ({ item: s, match: false }));

   return students;
};

function onSearchButtonClickHandler() {
   const value = input.value.toLocaleLowerCase();

   if(value == '') {
      return
   }

   for(let student of students) {    
      if(Object.values(student.item).some(v => v.toLocaleLowerCase().includes(value))) {
         student.match = true;
      } else {
         student.match = false;
      }
   }

   input.value = '';
   update(students);
}