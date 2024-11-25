const response = await fetch("/api/users");
//http://localhost:3000/api/users caso preciso do endo point para utilizar em projeto Mobile
const users = await response.json();
const table = document.getElementById("table");

users.forEach((user, index) => {
  const row = table.insertRow(-1);
  let currentCell = 0;
  const idCell = row.insertCell(currentCell++);
  const nameCell = row.insertCell(currentCell++);
  const emailCell = row.insertCell(currentCell++);
  const actionCell = row.insertCell(currentCell++);

  idCell.innerText = index;
  nameCell.innerText = user.name;
  emailCell.innerText = user.email;

  actionCell.innerHTML = `
    <a class="btn btn-primary" href="/update/${user.id}" role="button">Atualizar</a>
    <a class="btn btn-danger" href="/delete/${user.id}" role="button">Deletar</a>
    `;
});
