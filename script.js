//TODO mudar para função TOGGLE (liga/desliga), removendo essas duas existentes
const Modal = {
  open() {
    //Abrir modal
    //Adicionar a class active ao modal
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    //Fechar modal
    //Remover a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const btnNewTransition = document
  .querySelector("#new-transaction")
  .addEventListener("click", Modal.open);
const btnCancelTransition = document
  .querySelector("#cancel-trans")
  .addEventListener("click", Modal.close);

//TODO PODERIA TRATAR O ERRO para contar os elementos e assim não aceitar valor maior que isso
const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50001,
    date: "23/01/2021",
  },
  {
    id: 2,
    description: "WebSite",
    amount: 500000,
    date: "23/01/2021",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20012,
    date: "23/01/2021",
  },
  {
    id: 4,
    description: "App",
    amount: 200000,
    date: "23/01/2021",
  },
];

const Transaction = {
  all: transactions,
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },
  incomes() {
    let income = 0;
    //pegar todas as transactions, para cada transaction
    Transaction.all.forEach((transaction) => {
      //verificar se a transaction é maior que zero
      if (transaction.amount > 0) {
        //Se for maior que zero, somar a uma variável e retornar a variável
        income += transaction.amount;
      }
    });

    return income;
  },
  expenses() {
    let expense = 0;
    //pegar todas as transactions, para cada transaction
    Transaction.all.forEach((transaction) => {
      //verificar se a transaction é menor que zero
      if (transaction.amount < 0) {
        //Se for maior que zero, subtrair a uma variável e retornar a variável
        expense += transaction.amount;
      }
    });

    return expense;
  },
  total() {
    //total = Entradas - saídas
    let total = Transaction.incomes() + Transaction.expenses();
    return total;
  },
};

//Substituir os dados do HTML com os dados do JS
//Pegar transactions do meu objeto aqui no JS e colocar no HTML
const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const CSSClass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover transação" />
      </td>
    `;

    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, ""); //troca apenas a primeira ocorrência

    value = Number(value / 100);

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction) => DOM.addTransaction(transaction));

    DOM.updateBalance();
  },
  reload() {
    App.init();
  },
};

App.init();

Transaction.add({
  id: 39,
  description: "Olá",
  amount: 200,
  date: "23/01/2021",
});