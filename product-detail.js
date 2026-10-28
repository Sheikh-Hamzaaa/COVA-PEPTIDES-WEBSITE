(async () => {
  const container = document.querySelector('#product-detail');
  const status = document.createElement('p');
  status.className = 'cart-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  try {
    const name = new URLSearchParams(window.location.search).get('name');
    if (!name) throw new Error('Choose a product from the collection to view its details.');

    const response = await fetch('products.json');
    if (!response.ok) throw new Error(`Product catalog request failed with status ${response.status}`);
    const products = await response.json();
    const product = products.find(entry => entry.name === name);
    if (!product) throw new Error('That product could not be found. Return to the collection and choose another product.');

    const references = Array.isArray(product.references) ? product.references : [];
    container.innerHTML = `
      <div class="product-detail-visual">
        ${product.graphic
          ? `<img src="${escapeHtml(product.graphic)}" alt="${escapeHtml(product.graphic_alt || product.name)}">`
          : '<div class="product-detail-placeholder" aria-hidden="true">COVA PEP</div>'}
        <p>Packaging concept · final specifications confirmed in your quote</p>
      </div>
      <div class="product-detail-copy">
        <span class="category">${escapeHtml(product.category)}</span>
        <h1>${escapeHtml(product.name)}</h1>
        <h2>${escapeHtml(product.headline || '')}</h2>
        <p class="product-detail-short">${escapeHtml(product.short || '')}</p>
        <p class="product-detail-price"><strong>$0.00</strong> <span>USD</span></p>
        <p class="product-price-note">Displayed price for now. Availability and final quotation are confirmed in writing.</p>
        <button class="button" id="add-product" type="button">Add to your quote selection</button>
        <a class="product-detail-enquire" href="mailto:Info@covapep.com?subject=${encodeURIComponent(`COVA enquiry: ${product.name}`)}">Ask about this product ↗</a>
        <div class="product-detail-section">
          <h2>Product description</h2>
          <p>${escapeHtml(product.detail || product.description || product.short || '')}</p>
        </div>
        ${product.spec ? `
          <div class="product-detail-section">
            <h2>Specifications</h2>
            <p>${escapeHtml(product.spec)}</p>
          </div>
        ` : ''}
        ${product.description && product.detail ? `
          <details class="product-detail-context">
            <summary>Research context</summary>
            <p>${escapeHtml(product.description)}</p>
          </details>
        ` : ''}
        ${references.length ? `
          <div class="product-detail-section">
            <h2>References</h2>
            <ul class="product-references">
              ${references.map((reference, index) => `
                <li><a href="${escapeHtml(reference)}" target="_blank" rel="noopener noreferrer">Source ${index + 1} ↗</a></li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    container.append(status);

    container.querySelector('#add-product').addEventListener('click', () => {
      try {
        window.COVACart.add(product.name);
        status.textContent = `${product.name} added to your quote cart.`;
      } catch (error) {
        console.error('Unable to update the quote cart.', error);
        status.textContent = 'The quote cart could not be updated. Check your browser storage settings and try again.';
      }
    });
  } catch (error) {
    console.error('Unable to load product details.', error);
    container.innerHTML = `<p class="product-detail-error">${escapeHtml(error.message)} <a href="collection.html">Return to the collection</a>.</p>`;
  }
})();
