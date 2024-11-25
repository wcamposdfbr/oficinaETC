const createUserForm = document.getElementById("create-user-form");
const createUserButton = document.getElementById("create-user-button");
const spinner = document.getElementById("spinner");

const userNameInput = document.getElementById("user-name-input");
const userEmailInput = document.getElementById("user-email-input");

createUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Indicar ao usuário que algo está acontecendo
    createUserButton.toggleAttribute("disabled");
    spinner.toggleAttribute("hidden");

    const response = await fetch("/api/users", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: userNameInput.value,
        email: userEmailInput.value,
      }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    // Resposta recebida
    createUserButton.toggleAttribute("disabled");
    spinner.toggleAttribute("hidden");

    //back to home
    window.location.replace("/");
  } catch (error) {
    console.error(error.message);
  }
});
