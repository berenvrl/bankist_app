'use strict';
///////////Data /////////////
const account1 = {
  owner: 'Beren Varol',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %value
  pin: 1111,

  movementsDates: [
    '2023-02-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2023-03-19T13:15:33.035Z',
    '2023-03-14T13:15:33.035Z',
    '2023-03-18T13:15:33.035Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const account2 = {
  owner: 'Sansa Stark',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
  ],
  currency: 'USD',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Arya Stark',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Jon Snow',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
  ],
  currency: 'USD',
  locale: 'tr-TR',
};

const accounts = [account1, account2, account3, account4];

//Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUserName = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan--amount');
const inputCloseUserName = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcdayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcdayPassed(new Date(), date);
  //console.log(dayPassed);
  /*if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  */
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Displaying all current movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //if sort is true,sort et demek istedik asagıda
  //sort edilecek array original array olmamalı, bunun icin movements.sort yapmıyoruz, dikkat, arrayi kopyalamak icin slice kullanıyoruz
  //parametreye sortu ekleyerek sort eylemine entegre ettik displayMovements fonksiyonunu
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//creating total balance with reduce method

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//Calculation of total deposits, withdrawals, interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.balance, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//creating usernames
//createUserNames fonksiyonundan bir obj arrayi geciriyoruz
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease 1s
    time--;
  };
  //Set time to 5 minutes
  let time = 120;

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event handlers
//Set up login event

let currentAccount, timer;

//FAKE always logged in //setting date in span class
//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //butona tıkladıgımızda sayda surekli yenileniyor, cunku buton form icerisinde olusturulmus, bu yuzden fonksiyona bir event parametre olarak verip prevent default yapıyoruz, bkz html defalut behavior
  //prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUserName.value
  );
  //console.log(currentAccount);
  //currentAccount?.pin ile optional chaining yapıyoruz, yani eger girilen pin exist ise demiş olduk
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //console.log('LOGIN');
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date&time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    //const locale = navigator.language;
    //console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    /*const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    //set date with internalisation day/month/year
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;*/

    //Clear the input fields
    inputLoginUserName.value = inputLoginPin.value = '';
    //To remove focus from pin side(remove cursor)
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

//Setting for money transfer to an account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //console.log(amount, receiverAcc);

  //clearing transfer amount and to side after we click
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//Closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUserName.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //console.log(index);

    //Deleting account
    accounts.splice(index, 1);

    //Hide UI to a closed/deleted account
    containerApp.style.opacity = 0;
  }
  //Clear the input fields in close account part
  inputCloseUserName.value = inputClosePin.value = '';
});

//Sort button set

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
