const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'finance.json');

let state = { users: {} };
let initialized = false;

const ensureDir = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
};

const load = async () => {
  await ensureDir();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    state = parsed && typeof parsed === 'object' ? parsed : { users: {} };
  } catch (err) {
    if (err.code === 'ENOENT') {
      state = { users: {} };
      await persist();
    } else {
      console.error('Failed to load finance data file:', err.message);
      state = { users: {} };
    }
  }
  initialized = true;
};

const persist = async () => {
  await ensureDir();
  const tmpPath = `${DATA_FILE}.tmp`;
  const payload = JSON.stringify(state, null, 2);
  await fs.writeFile(tmpPath, payload, 'utf8');
  await fs.rename(tmpPath, DATA_FILE);
};

const ensureLoaded = async () => {
  if (!initialized) {
    await load();
  }
};

const getUserState = (userId = 'default') => {
  if (!state.users[userId]) {
    state.users[userId] = { transactions: [], goal: null };
  }
  return state.users[userId];
};

const listTransactions = async (userId = 'default') => {
  await ensureLoaded();
  return getUserState(userId).transactions;
};

const addTransaction = async (userId = 'default', txn) => {
  await ensureLoaded();
  const userState = getUserState(userId);
  userState.transactions.push(txn);
  await persist();
  return txn;
};

const setGoal = async (userId = 'default', goal) => {
  await ensureLoaded();
  const userState = getUserState(userId);
  userState.goal = goal;
  await persist();
  return goal;
};

const getGoal = async (userId = 'default') => {
  await ensureLoaded();
  return getUserState(userId).goal;
};

module.exports = {
  ensureLoaded,
  listTransactions,
  addTransaction,
  setGoal,
  getGoal
};
