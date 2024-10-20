import { Order } from './index';

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
