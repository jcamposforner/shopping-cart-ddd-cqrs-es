const common = [
    '--require-module ts-node/register' // Load TypeScript module
];

const sales = [
    ...common,
    'tests/apps/sales/features/**/*.feature',
    '--require tests/apps/sales/definitions/*.steps.ts'
].join(' ');

module.exports = {
    sales
};