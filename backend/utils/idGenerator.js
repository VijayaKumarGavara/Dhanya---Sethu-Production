// utils/idGenerator.js
function generateCustomUserId(role) {
  const rolePrefix = {
    farmer: 'FARM',
    buyer: 'BUY',
    worker: 'WORK'
  };

  const prefix = rolePrefix[role.toLowerCase()];
  if (!prefix) throw new Error('Invalid role');

  const last5Time = Date.now().toString().slice(-5);
  const random5 = Math.floor(10000 + Math.random() * 90000);

  return `${prefix}${last5Time}${random5}`;
}

module.exports = generateCustomUserId;
