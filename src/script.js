const form = document.getElementById("studentForm");
    const tableBody = document.getElementById("tableBody");
    const submitBtn = document.getElementById("submitBtn");

    let editId = null;

    // Load students on page load
    window.addEventListener("DOMContentLoaded", () => {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      students.forEach(student => addStudentToTable(student));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("studentName").value.trim();
      const idValue = document.getElementById("studentId").value.trim();
      const email = document.getElementById("email").value.trim();
      const contactValue = document.getElementById("contact").value.trim();

      if (!name || !idValue || !email || !contactValue) {
        alert("Please fill the form.");
        return;
      }

      const id = parseInt(idValue);
      const contact = parseInt(contactValue);

      if (isNaN(id) || isNaN(contact)) {
        alert("ID and Contact must be numbers.");
        return;
      }

      let students = JSON.parse(localStorage.getItem("students")) || [];

      if (editId !== null) {
        // Update
        students = students.map(student =>
          student.id === editId ? { name, id, email, contact } : student
        );
        editId = null;
        submitBtn.textContent = "Register";
      } else {
        const exists = students.some(s => s.id === id);
        if (exists) {
          alert("This Student ID already exists.");
          return;
        }
        students.push({ name, id, email, contact });
      }

      localStorage.setItem("students", JSON.stringify(students));

      // Re-render table
      tableBody.innerHTML = "";
      students.forEach(student => addStudentToTable(student));

      form.reset();
    });

    function addStudentToTable(student, isNew = false) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="border px-2 py-1">${student.name}</td>
        <td class="border px-2 py-1">${student.id}</td>
        <td class="border px-2 py-1">${student.email}</td>
        <td class="border px-2 py-1">${student.contact}</td>
        <td class="border px-2 py-1">
          <button onclick="editStudent(${student.id})" class="text-yellow-400 hover:text-yellow-500 mr-4 hover:cursor-pointer">Edit</button>
          <button onclick="deleteStudent(${student.id}, this)" class="text-red-400 hover:text-red-600 hover:cursor-pointer">Delete</button>
        </td>
      `;
      if(isNew){
        row.classList.add("cardAnimate")
      }
      tableBody.appendChild(row);
    }

    function deleteStudent(id, btn) {
      let students = JSON.parse(localStorage.getItem("students")) || [];
      students = students.filter(student => student.id !== id);
      localStorage.setItem("students", JSON.stringify(students));

      const row = btn.closest("tr");
      row.remove();
    }

    function editStudent(id) {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      const student = students.find(s => s.id === id);

      if (student) {
        document.getElementById("studentName").value = student.name;
        document.getElementById("studentId").value = student.id;
        document.getElementById("email").value = student.email;
        document.getElementById("contact").value = student.contact;

        editId = student.id;
        submitBtn.textContent = "Update";
      }
    }