/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/



/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/


const studentsPerPage = 9

/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/

const generateStudentNode = (student) => {
   const createStudentDiv = () => {
      //create parent div
      const divStudent = document.createElement('div');
      divStudent.className = 'student-details';

      //create img node
      const img = document.createElement('img')
      img.className = 'avatar';
      img.src = student.picture.large;
      img.alt = 'Profile Picture';
      divStudent.appendChild(img)

      //create student name heading
      const h3 = document.createElement('h3')
      h3.innerText = `${student.name.first} ${student.name.last}`
      divStudent.appendChild(h3)

      //create email node
      const emailSpan = document.createElement('span')
      emailSpan.className = 'email'
      emailSpan.innerText = student.email
      divStudent.appendChild(emailSpan)

      return divStudent;
   }

   const createdJoinnedDiv = () => {
      const joinnedDiv = document.createElement('div')
      joinnedDiv.className = 'joined-details';
      const dateSpan = document.createElement('span')
      dateSpan.className = 'date'
      dateSpan.innerText = `Joinned ${student.registered.date}`
      joinnedDiv.appendChild(dateSpan)

      return joinnedDiv
   }
   const li = document.createElement('li');
   li.classList = 'student-item cf';
   li.appendChild(createStudentDiv())
   li.appendChild(createdJoinnedDiv())
   return li
}

const showPage = (data, page) => {
   const start = page * studentsPerPage;
   const end = start + studentsPerPage;
   const ul = document.querySelector('.student-list');
   ul.innerHTML = ''
   const students = data.slice(start, end)
   students.forEach(student => {
      ul.appendChild(generateStudentNode(student))
   });
}


/**
 * Remove the active from any sibling
 * @param {HTMLElement} element 
 */

const clearActive = (element) => {
   const active = document.querySelectorAll('.active')
   for (let btn of active) {
      //skip if its the same element
      if (btn === element) continue;
      btn.classList.remove('active')
   }
}


/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

const addPagination = (data) => {
   const pages = new Array(Math.ceil(data.length / studentsPerPage)).fill('page')
   const ul = document.querySelector('.link-list')
   ul.innerHTML = ''
   pages.forEach((_, i) => {
      const li = document.createElement('li')
      const button = document.createElement('button')
      button.type = 'button'
      button.innerText = i + 1
      li.appendChild(button)
      ul.appendChild(li)
      //TODO: Add Event listener
      button.addEventListener('click', (e) => {
         const page = parseInt(e.target.innerText) - 1;
         e.target.className = 'active'
         clearActive(e.target)
         showPage(data, page)
      })
   })
}


//Extra Credit

const renderSearchBar = (headerElement) => {
   const searchBar = document.createElement('label');
   searchBar.for = 'search';
   searchBar.className = 'student-search'
   const html = `
         <span>Search by name</span>
         <input id="search" placeholder="Search by name...">
         <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
   `
   searchBar.innerHTML = html
   headerElement.appendChild(searchBar)
}

//souce https://levelup.gitconnected.com/use-regex-and-javascript-to-improve-search-results-870932050d08
const checkName = (name, input) => {
   var pattern = input.toLowerCase().split("").map((x) => {
      return `(?=.*${x})`
   }).join("");
   var regex = new RegExp(`${pattern}`, "g")
   return name.match(regex);
}

const searchFunction = (input, data) => {
   const filteredArray = data.filter(student => {
      const name = `${student.name.first} ${student.name.last}`.toLowerCase()
      return checkName(name, input)
   })
   return filteredArray;
}

const handleFilterRendering = (filteredArray) => {
   if (filteredArray.length) {
      showPage(filteredArray, 0)
      addPagination(filteredArray)
   } else {
      const error = document.createElement('h3')
      error.className = 'error-message'
      error.innerText = 'No results found'
      const ul = document.querySelector('.student-list')
      ul.innerHTML = ''
      ul.appendChild(error)
      addPagination(filteredArray)
   }
}

const searchBar = (data) => {
   const header = document.querySelector('.header')
   //render the search bar
   renderSearchBar(header)
   //select the input and button elements
   const input = document.querySelector('#search');
   const button = document.querySelector('.student-search').lastChild
   input.addEventListener('keyup', (e) => {
      const input = e.target.value
      const filteredArray = searchFunction(input, data)
      handleFilterRendering(filteredArray)
   })
   button.addEventListener('click', (e) => {
      const filteredArray = searchFunction(input.value, data)
      handleFilterRendering(filteredArray)
   })
}


// Call functions
//initial page is 0 to make it easier to work with the index
showPage(data, 0)
addPagination(data)
searchBar(data)