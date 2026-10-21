'use strict';

const readline = require('node:readline');

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
const lines = rl[Symbol.asyncIterator]();

async function ask(prompt) {
  process.stdout.write(prompt);
  const { value, done } = await lines.next();
  return done ? '' : value.trim();
}

async function askNumber(prompt) {
  const value = await ask(prompt);
  return value === '' ? NaN : Number(value);
}

function ticketPrice(category) {
  switch (category) {
    case 1: return 300;
    case 2: return 500;
    case 3: return 900;
    default: return 0;
  }
}

function maxTickets(budget, price) {
  if (price <= 0) return 0;
  let count = 0;
  let remaining = budget;
  while (remaining >= price) {
    remaining -= price;
    count++;
  }
  return count;
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category);
  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }
  if (!Number.isFinite(budget) || budget < 0) {
    console.log('некорректные данные');
    return;
  }
  const count = maxTickets(budget, price);
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`);
}

function deliveryPrice(distance, total) {
  if (total >= 3000 || distance <= 3) return 0;
  if (distance <= 10) return 200;
  return 200 + 25 * (distance - 10);
}

function printDelivery(distance, total) {
  if (!Number.isFinite(distance) || !Number.isFinite(total) || distance < 0 || total < 0) {
    console.log('некорректные данные');
    return;
  }
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${deliveryPrice(distance, total)} руб.`);
}

function printSteps(height) {
  if (!Number.isInteger(height) || height < 0) {
    console.log('некорректные данные');
    return;
  }
  let built = 0;
  for (let step = 1; step <= height; step++) {
    if (step === 4) continue;
    if (step > 10) {
      console.log('Дальше лестница не построена');
      break;
    }
    console.log(`Ступень ${step}`);
    built++;
  }
  console.log(`Всего построено: ${built}`);
}

async function main() {
  console.log('Выберите задачу:');
  console.log('1 — билетная касса');
  console.log('2 — доставка заказа');
  console.log('3 — лестница');

  const choice = await ask('Ваш выбор: ');
  switch (choice) {
    case '1': {
      const category = await askNumber('Категория билета: ');
      if (ticketPrice(category) === 0) {
        printTicketResult(category, 0);
        break;
      }
      const budget = await askNumber('Бюджет: ');
      printTicketResult(category, budget);
      break;
    }
    case '2': {
      const distance = await askNumber('Расстояние: ');
      const total = await askNumber('Сумма заказа: ');
      printDelivery(distance, total);
      break;
    }
    case '3': {
      const height = await askNumber('Высота лестницы: ');
      printSteps(height);
      break;
    }
    default:
      console.log('такой задачи нет');
  }
}

main().finally(() => rl.close());
