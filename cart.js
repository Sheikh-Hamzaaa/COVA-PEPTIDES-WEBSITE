(() => {
  const storageKey = 'cova-quote-cart-v1';
  const listeners = new Set();

  function getItems() {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === null) return [];

    const items = JSON.parse(stored);
    if (!Array.isArray(items) || items.some(item =>
      !item || typeof item.name !== 'string' || !item.name.trim() ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    )) {
      throw new Error('Stored quote cart has an invalid format.');
    }
    return items;
  }

  function updateCount() {
    const count = getItems().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(element => {
      element.textContent = String(count);
      element.parentElement.setAttribute('aria-label', `Quote cart, ${count} ${count === 1 ? 'item' : 'items'}`);
    });
  }

  function save(items) {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
    updateCount();
    listeners.forEach(listener => listener());
  }

  window.COVACart = {
    getItems,
    add(name) {
      const items = getItems();
      const existing = items.find(item => item.name === name);
      if (existing) {
        if (existing.quantity >= 99) throw new Error('A selection cannot exceed 99 units.');
        existing.quantity += 1;
      } else {
        items.push({ name, quantity: 1 });
      }
      save(items);
    },
    setQuantity(name, quantity) {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        throw new Error('Quantity must be between 1 and 99.');
      }
      const items = getItems();
      const item = items.find(entry => entry.name === name);
      if (!item) throw new Error('That selection is no longer in the quote cart.');
      item.quantity = quantity;
      save(items);
    },
    remove(name) {
      save(getItems().filter(item => item.name !== name));
    },
    clear() {
      save([]);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };

  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      try {
        updateCount();
        listeners.forEach(listener => listener());
      } catch (error) {
        console.error('Unable to refresh the quote cart.', error);
      }
    }
  });

  try {
    updateCount();
  } catch (error) {
    console.error('Unable to read the quote cart.', error);
  }
})();
