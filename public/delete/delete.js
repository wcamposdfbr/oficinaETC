const id = window.location.href.split("/delete/")[1].replace("/", "");

const deleteUserButton = document.getElementById("delete-user-button");
const spinner = document.getElementById("spinner");

const createUserForm = document.getElementById("create-user-form");

const userNameInput = document.getElementById("user-name-input");
const userEmailInput = document.getElementById("user-email-input");

let user;

try {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();

  userNameInput.value = user.name;
  userEmailInput.value = user.email;
} catch (error) {
  console.log(error);
}

createUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Indicar ao usuário que algo está acontecendo
    deleteUserButton.toggleAttribute("disabled");
    spinner.toggleAttribute("hidden");

    const response = await fetch(`/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    // Resposta recebida
    deleteUserButton.toggleAttribute("disabled");
    spinner.toggleAttribute("hidden");

    window.location.replace("/");
  } catch (error) {
    console.error(error.message);
  }
});
