import { DiscountService } from "../DiscountService.js";

class TestDiscountStrategy {
    apply(price) {
      return price / 100 * 30;
    }
  }

describe('DiscountService', () => {
    let discountService;
  
    beforeEach(() => {
      discountService = new DiscountService();
    });
  
    test('Проверка корректного использования стратегии скидок', () => {
      const strategy = new TestDiscountStrategy();
      discountService.setDiscountStrategy(strategy);
      const finalPrice = discountService.getFinalPrice(900);
      expect(finalPrice).toBe(630);
    });
  
    test('Проверка выбрасывания ошибки, если стратегия не установлена', () => {
      expect(() => discountService.getFinalPrice(900)).toThrow('Стратегия скидок не установлена');
    });
  
    test('Проверка сохранения истории скидок', () => {
      const strategy = new TestDiscountStrategy();
      discountService.setDiscountStrategy(strategy);
      discountService.getFinalPrice(900);
      
      const history = discountService.getDiscountHistory();
      expect(history.length).toBe(1);
      expect(history[0]).toEqual({ originalPrice: 900, discountedPrice: 630 });
    });
  
    test('Проверка очистки истории', () => {
      const strategy = new TestDiscountStrategy();
      discountService.setDiscountStrategy(strategy);
      discountService.getFinalPrice(900);
      discountService.clearHistory();
  
      expect(discountService.getDiscountHistory()).toEqual([]); 
    });
  
    test('Проверка работы с разными стратегиями', () => {
      class AnotherDiscountStrategy {
        apply(price) {
          return price / 2;
        }
      }
      
      const strategy1 = new TestDiscountStrategy();
      const strategy2 = new AnotherDiscountStrategy();
      
      discountService.setDiscountStrategy(strategy1);
      expect(discountService.getFinalPrice(900)).toBe(630);
  
      discountService.setDiscountStrategy(strategy2);
      expect(discountService.getFinalPrice(900)).toBe(450);
    });
  });