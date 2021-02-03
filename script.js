
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

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

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);

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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const CSSClass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
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
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    //value = Number(value.replace(/\,\./g, "")) * 100; //remove vírgula e ponto, depois multiplica por 100
    value = Number(value) * 100;

    return value;
  },
  formatDate(date) {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
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

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },
  validateFields() {
    // const description = Form.getValues().description;
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos!");
    }
  },
  // saveTransaction(transaction) {
  //   Transaction.add(transaction);
  // },
  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  submit(event) {
    event.preventDefault();

    try {
      //verificar se todas as informações foram preenchidas
      Form.validateFields();

      //Formatar os dados para Salvar
      const transaction = Form.formatValues();

      //Salvar
      Transaction.add(transaction);

      //Limpar os campos do formulário
      Form.clearFields();

      //Modal feche
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};


const App = {
  init() {
    //Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index));
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

const btnNewTransition = document
  .querySelector("#new-transaction")
  .addEventListener("click", Modal.open);
const btnCancelTransition = document
  .querySelector("#cancel-trans")
  .addEventListener("click", Modal.close);
