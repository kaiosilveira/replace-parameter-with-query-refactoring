[![Continuous Integration](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Replace Parameter With Query

**Formerly: Replace Parameter with Method**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
availableVacation(anEmployee, anEmployee.grade);

function availableVacation(anEmployee, grade) {
  // calculate vacation...
```

</td>

<td>

```javascript
availableVacation(anEmployee);

function availableVacation(amEmployee) {
  const grade = anEmployee.grade;
  // calculate vacation...
```

</td>
</tr>
</tbody>
</table>

**Inverse of: [Replace Query with Parameter](https://github.com/kaiosilveira/replace-query-with-parameter-refactoring)**

Data can take many shapes and form, and so does function signatures. Sometimes, though, we can easily derive values from a related top-level structure that we already have access to, therefore simplifying argument lists and reliefing callers of one more parameter. This refactoring helps with that.

## Working example

Our working example is a simple program which calculates the final price of an `Order`, based on its item quantity, base price, and discount level. `Order` looks like this:

```javascript
export class Order {
  constructor({ quantity, itemPrice }) {
    this.quantity = quantity;
    this.itemPrice = itemPrice;
  }

  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    let discountLevel;
    if (this.quantity > 100) discountLevel = 2;
    else discountLevel = 1;
    return this.discountedPrice(basePrice, discountLevel);
  }

  discountedPrice(basePrice, discountLevel) {
    switch (discountLevel) {
      case 1:
        return basePrice * 0.95;
      case 2:
        return basePrice * 0.9;
    }
  }
}
```

Our goal here is to get rid of the duplicated logic around `discountLevel`.

### Test suite

The imlpemented test suite for this example covers the border of the conditional logic around discount levels:

```javascript
describe('Order', () => {
  describe('finalprice', () => {
    it('should apply discount level 1 if quantity is lower than 100', () => {
      const order = new Order({ quantity: 10, itemPrice: 10 });
      expect(order.finalPrice).toBe(95);
    });

    it('should apply discount level 1 if quantity is equal 100', () => {
      const order = new Order({ quantity: 100, itemPrice: 10 });
      expect(order.finalPrice).toBe(950);
    });

    it('should apply discount level 2 if quantity is higher than 100', () => {
      const order = new Order({ quantity: 101, itemPrice: 10 });
      expect(order.finalPrice).toBe(909);
    });
  });
});
```

With that in place, we're good to go.

### Steps

We started by introducing a `discountLevel` getter. This will strategically relief `finalPrice` of calculating its value:

```diff
+  get discountLevel() {
+    return this.quantity > 100 ? 2 : 1;
+  }
```

Then, we replace the derivation of `discountLevel` at `finalPrice` with a call to the new `discountLevel` getter, effectively removing the need to calculate this parameter and allowing us to remove all the temps related to it:

```diff
   get finalPrice() {
     const basePrice = this.quantity * this.itemPrice;
-    return this.discountedPrice(basePrice, discountLevel);
+    return this.discountedPrice(basePrice, this.discountLevel);
   }
```

Going even further, we now can call the `discountLevel` getter directly at `discountedPrice`, instead of receiving it as argument:

```diff
   discountedPrice(basePrice, discountLevel) {
-    switch (discountLevel) {
+    switch (this.discountLevel) {
```

And since the argument is now useless, we just remove it:

```diff
   get finalPrice() {
     const basePrice = this.quantity * this.itemPrice;
-    return this.discountedPrice(basePrice, this.discountLevel);
+    return this.discountedPrice(basePrice);
   }

-  discountedPrice(basePrice, discountLevel) {
+  discountedPrice(basePrice) {
     switch (this.discountLevel) {
```

And that's all for this one!

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                          | Message                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [7fad9bc](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/commit/7fad9bc7b7ad52f6a69366ca3fa6b5e3b3251c0d) | introduce `discountLevel` getter                                                                    |
| [025c71c](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/commit/025c71c461d05d027506416d483c52a5cbb03314) | replace derivation of `discountLevel` at `finalPrice` with a call to the new `discountLevel` getter |
| [c5d4999](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/commit/c5d499998154dd12742d064b6c73cda4febff3ea) | call `discountLevel` getter instead of receiving it as argument at `discountedPrice`                |
| [d490a84](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/commit/d490a849c62c1d36a54d4681271cfb317bb05a5c) | remove `discountLevel` argument at `discountedPrice`                                                |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-parameter-with-query-refactoring/commits/main).
