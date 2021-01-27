const Modal = {
  open() {
    //Abrir modal
    //Adicionar a class active ao modal
    document.querySelector(".modal-overlay").classList.add("active");

    console.log("Abrir modal");
  },
  close() {
    //Fechar modal
    //Remover a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");

    console.log("Fechou modal");
  },
};

const btnNewTransition = document
  .querySelector("#new-transaction")
  .addEventListener("click", Modal.open);
const btnCancelTransition = document
  .querySelector("#cancel-trans")
  .addEventListener("click", Modal.close);
