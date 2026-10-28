(async () => {
  const response = await fetch('products.json');
  if (!response.ok) {
    throw new Error(`Collection request failed with status ${response.status}`);
  }

  const products = await response.json();
  const filters = document.querySelector('#filters');
  const catalog = document.querySelector('#catalog');
  const search = document.querySelector('#search');
  const status = document.querySelector('#cart-status');
  const resultCount = document.querySelector('#result-count');
  const empty = document.querySelector('#empty');
  let category = 'All';

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  function productUrl(product) {
    return `product.html?name=${encodeURIComponent(product.name)}`;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const matches = products.filter(product =>
      (category === 'All' || product.category === category) &&
      [product.name, product.category, product.headline, product.short, product.description]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );

    catalog.innerHTML = matches.map(product => `
      <article class="product">
        ${product.graphic ? `
          <figure class="product-visual">
            <a class="product-detail-link" href="${escapeHtml(productUrl(product))}" aria-label="View full details for ${escapeHtml(product.name)}">
              <img src="${escapeHtml(product.graphic)}" alt="${escapeHtml(product.graphic_alt)}" loading="lazy" width="1448" height="1086">
            </a>
            <figcaption>Packaging concept · specifications confirmed in your quote</figcaption>
          </figure>
        ` : ''}
        <div class="product-copy">
          <span class="category">${escapeHtml(product.category)}</span>
          <h3><a class="product-detail-link" href="${escapeHtml(productUrl(product))}">${escapeHtml(product.name)}</a></h3>
          <h4>${escapeHtml(product.headline)}</h4>
          <p class="product-short">${escapeHtml(product.short || product.description)}</p>
          <a class="product-details-link" href="${escapeHtml(productUrl(product))}">View full product details ↗</a>
          <details>
            <summary>View research context</summary>
            <p>${escapeHtml(product.description)}</p>
            ${product.spec ? `<p class="product-spec"><strong>Product specifications:</strong> ${escapeHtml(product.spec)}</p>` : ''}
            ${product.references.map((reference, index) => `
              <a class="reference" href="${escapeHtml(reference)}" target="_blank" rel="noopener">
                Source ${index + 1} ↗
              </a>
            `).join(' · ')}
          </details>
          <div class="product-actions">
            <button class="add-to-cart" type="button" data-product="${escapeHtml(product.name)}">Add to your selection</button>
            <a class="enquire" href="mailto:Info@covapep.com?subject=${encodeURIComponent(`COVA enquiry: ${product.name}`)}">Ask about this product ↗</a>
          </div>
        </div>
      </article>
    `).join('');

    resultCount.textContent = `Showing ${matches.length} of ${products.length} selections`;
    empty.hidden = matches.length > 0;
  }

  for (const option of ['All', ...new Set(products.map(product => product.category))]) {
    const button = document.createElement('button');
    button.className = 'filter';
    button.type = 'button';
    button.textContent = option;
    button.setAttribute('aria-pressed', String(option === category));
    button.addEventListener('click', () => {
      category = option;
      filters.querySelectorAll('.filter').forEach(filter => {
        filter.setAttribute('aria-pressed', String(filter === button));
      });
      render();
    });
    filters.append(button);
  }

  catalog.addEventListener('click', event => {
    const button = event.target.closest('button[data-product]');
    if (!button) return;

    try {
      window.COVACart.add(button.dataset.product);
      status.textContent = `${button.dataset.product} added to your quote cart.`;
    } catch (error) {
      console.error('Unable to update the quote cart.', error);
      status.textContent = 'The quote cart could not be updated. Check your browser storage settings and try again.';
    }
  });

  search.addEventListener('input', render);
  empty.querySelector('button').addEventListener('click', () => {
    search.value = '';
    category = 'All';
    filters.querySelectorAll('.filter').forEach(filter => {
      filter.setAttribute('aria-pressed', String(filter.textContent === category));
    });
    render();
    search.focus();
  });

  render();
})().catch(error => {
  console.error('Unable to load the COVA collection.', error);
  document.querySelector('#catalog').textContent =
    'The collection could not be loaded. Please try again or email Info@covapep.com.';
});
