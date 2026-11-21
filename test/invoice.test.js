var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function makeOrder(overrides) {
  var order = {
    id: 42,
    items: [{
      id: 1,
      sku: 'RICE-1',
      name: 'Rice',
      hsn: '1006',
      price: 1000,
      qty: 2
    }],
    coupon: '',
    subtotal: 2000,
    discount: 0,
    tax: 100,
    total: 2100
  };
  Object.keys(overrides || {}).forEach(function (key) {
    order[key] = overrides[key];
  });
  return order;
}

test('invoice uses the HSN GST slab applied when the order was billed', function () {
  var order = makeOrder();
  var billed = pricing.computeTotals(order.items, order.coupon);
  var figures = invoice.computeInvoiceFigures(order);

  assert.equal(billed.lines[0].gstPercent, 5);
  assert.equal(billed.tax, 100);
  assert.equal(billed.total, 2100);
  assert.equal(figures.rows[0].gstPercent, 5);
  assert.equal(figures.tax, billed.tax);
  assert.equal(figures.total, billed.total);
});

test('invoice applies the same coupon discount and total as order pricing', function () {
  var order = makeOrder({ coupon: 'SAVE10', discount: 150, tax: 92.5, total: 1942.5 });
  var billed = pricing.computeTotals(order.items, order.coupon);
  var figures = invoice.computeInvoiceFigures(order);

  assert.equal(billed.discount, 150);
  assert.equal(billed.total, 1942.5);
  assert.equal(figures.discount, billed.discount);
  assert.equal(figures.tax, billed.tax);
  assert.equal(figures.total, billed.total);
});

test('invoice line GST amount reflects the apportioned coupon discount', function () {
  var order = makeOrder({ coupon: 'SAVE10' });
  var figures = invoice.computeInvoiceFigures(order);

  assert.equal(figures.rows[0].line, 2000);
  assert.equal(figures.rows[0].lineTax, 92.5);
  assert.equal(figures.tax, 92.5);
  assert.equal(figures.discount, 150);
});

test('invoice matches the order total without a reconciliation warning', function () {
  var order = makeOrder({ total: 2100 });
  var html = invoice.render(order);

  assert.match(html, /Invoice Total<\/td><td class="r">[^0-9]*2100\.00/);
  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
});
