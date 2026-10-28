(() => {
  const cart = window.COVACart;
  const cartLines = document.querySelector('#cart-lines');
  const cartEmpty = document.querySelector('#cart-empty');
  const quoteSection = document.querySelector('#quote-section');
  const errorMessage = document.querySelector('#cart-error');
  const quoteForm = document.querySelector('#quote-form');
  const emailFallback = document.querySelector('#email-fallback');
  const sendEmailLink = document.querySelector('#send-email');
  const requestDetails = document.querySelector('#request-details');
  const productsByName = new Map();
  let latestRequest = '';

  function showError(message) {
    errorMessage.textContent = message;
  }

  function render() {
    const items = cart.getItems();
    cartLines.replaceChildren();
    cartEmpty.hidden = items.length > 0;
    quoteSection.hidden = items.length === 0;
    emailFallback.hidden = true;
    sendEmailLink.hidden = true;
    latestRequest = '';

    for (const item of items) {
      const line = document.createElement('article');
      line.className = 'cart-line';
      const info = document.createElement('div');
      info.className = 'cart-line-info';
      const name = document.createElement('h3');
      name.textContent = item.name;
      const category = document.createElement('p');
      category.textContent = productsByName.get(item.name)?.category ?? 'COVA collection';
      info.append(name, category);

      const controls = document.createElement('div');
      controls.className = 'cart-line-controls';
      const quantityLabel = document.createElement('label');
      quantityLabel.textContent = 'Qty';
      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '1';
      quantity.max = '99';
      quantity.step = '1';
      quantity.value = String(item.quantity);
      quantity.setAttribute('aria-label', `Quantity for ${item.name}`);
      quantity.addEventListener('change', () => {
        const nextQuantity = Number(quantity.value);
        try {
          cart.setQuantity(item.name, nextQuantity);
          showError('');
        } catch (error) {
          showError(error.message);
          quantity.value = String(item.quantity);
        }
      });
      quantityLabel.append(quantity);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'text-button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${item.name}`);
      remove.addEventListener('click', () => {
        cart.remove(item.name);
        showError('');
      });
      controls.append(quantityLabel, remove);
      line.append(info, controls);
      cartLines.append(line);
    }
  }

  function requestText(formData) {
    const selections = cart.getItems().map(item => `- ${item.name} — quantity: ${item.quantity}`).join('\n');
    const notes = formData.get('notes').trim();
    return [
      'COVA PEP — Written quotation request',
      '',
      `Name: ${formData.get('name').trim()}`,
      `Email: ${formData.get('email').trim()}`,
      `Destination: ${formData.get('city').trim()}, ${formData.get('postalCode').trim()}, ${formData.get('country').trim()}`,
      '',
      'Requested selections:',
      selections,
      '',
      `Additional notes: ${notes || 'None'}`,
      '',
      'Please confirm availability, product specifications, pricing and shipping charges.'
    ].join('\n');
  }

  document.querySelector('#clear-cart').addEventListener('click', () => {
    cart.clear();
    showError('');
    emailFallback.hidden = true;
  });

  quoteForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    if (cart.getItems().length === 0) {
      showError('Add at least one selection before requesting a quote.');
      return;
    }

    latestRequest = requestText(new FormData(quoteForm));
    requestDetails.value = latestRequest;
    emailFallback.hidden = false;
    const subject = encodeURIComponent('COVA written quotation request');
    sendEmailLink.href = `mailto:Info@covapep.com?subject=${subject}&body=${encodeURIComponent(latestRequest)}`;
    sendEmailLink.hidden = false;
  });

  document.querySelector('#copy-request').addEventListener('click', async () => {
    const copyStatus = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(latestRequest);
      copyStatus.textContent = 'Request details copied.';
    } catch (error) {
      console.error('Unable to copy the quote request.', error);
      requestDetails.focus();
      requestDetails.select();
      copyStatus.textContent = 'Automatic copying is unavailable. Select and copy the request details above.';
    }
  });

  async function loadProducts() {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error(`Product catalog request failed with status ${response.status}`);
    const products = await response.json();
    for (const product of products) productsByName.set(product.name, product);
  }

  cart.subscribe(() => {
    try {
      render();
    } catch (error) {
      console.error('Unable to render the quote cart.', error);
      showError('The quote cart could not be displayed. Please reload this page.');
    }
  });

  loadProducts().then(render).catch(error => {
    console.error('Unable to load quote cart details.', error);
    showError('Product details could not be loaded. Please reload this page or email Info@covapep.com.');
  });
})();
