function generateHealthId() {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `MV-${part1}-${part2}`;
}

module.exports = generateHealthId;
