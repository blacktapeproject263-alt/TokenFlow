/**
 * TokenBudgetWidget - Custom Element for Antigravity & LLM Session Quotas
 * Tracks token allocation, consumption, remaining budget, and warning thresholds.
 */
class TokenBudgetWidget extends HTMLElement {
  static get observedAttributes() {
    return ['limit', 'used', 'model'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Defaults
    this.limit = 1000000; // 1M tokens by default
    this.used = 0;
    this.model = 'Gemini 3.8 Flash (High)';
  }

  connectedCallback() {
    this.loadFromStorage();
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'limit') this.limit = parseInt(newValue, 10) || 1000000;
      if (name === 'used') this.used = parseInt(newValue, 10) || 0;
      if (name === 'model') this.model = newValue;
      this.render();
    }
  }

  loadFromStorage() {
    const saved = localStorage.getItem('antigravity_token_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.limit) this.limit = data.limit;
        if (data.used !== undefined) this.used = data.used;
      } catch (e) {
        console.warn('Failed to parse token storage state', e);
      }
    }
  }

  saveToStorage() {
    localStorage.setItem(
      'antigravity_token_state',
      JSON.stringify({ limit: this.limit, used: this.used, model: this.model })
    );
  }

  consumeTokens(amount) {
    this.used = Math.min(this.limit, this.used + amount);
    this.saveToStorage();
    this.render();
  }

  resetTokens() {
    this.used = 0;
    this.saveToStorage();
    this.render();
  }

  setLimit(newLimit) {
    this.limit = newLimit;
    if (this.used > this.limit) this.used = this.limit;
    this.saveToStorage();
    this.render();
  }

  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  render() {
    const remaining = Math.max(0, this.limit - this.used);
    const percentLeft = Math.max(0, Math.min(100, Math.round((remaining / this.limit) * 100)));
    
    let statusClass = 'optimal';
    let statusText = 'Optimal';
    let badgeClass = 'badge-optimal';

    if (percentLeft <= 20) {
      statusClass = 'danger';
      statusText = 'Critical Low';
      badgeClass = 'badge-danger';
    } else if (percentLeft <= 50) {
      statusClass = 'warning';
      statusText = 'Caution';
      badgeClass = 'badge-warning';
    }

    const estimatedCostUsd = ((this.used / 1000000) * 0.15).toFixed(4);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./src/token-widget.css">
      <div class="widget-card">
        <div class="widget-header">
          <div class="widget-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Token Budget Monitor
          </div>
          <span class="status-badge ${badgeClass}">${statusText}</span>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Remaining Tokens</div>
            <div class="metric-value" style="color: ${percentLeft <= 20 ? '#f87171' : percentLeft <= 50 ? '#fbbf24' : '#34d399'}">
              ${this.formatNumber(remaining)}
            </div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Consumed / Limit</div>
            <div class="metric-value" style="font-size: 1.05rem;">
              ${this.formatNumber(this.used)} / ${this.formatNumber(this.limit)}
            </div>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-track">
            <div class="progress-bar ${statusClass}" style="width: ${percentLeft}%"></div>
          </div>
          <div class="progress-meta">
            <span>Context Remaining: <strong>${percentLeft}%</strong></span>
            <span>Est. Cost: <strong>$${estimatedCostUsd}</strong></span>
          </div>
        </div>

        <div class="controls-section">
          <div class="controls-label">Simulate Consumption & Preset Limits:</div>
          <div class="button-group">
            <button id="add-10k">+10k</button>
            <button id="add-50k">+50k</button>
            <button id="add-250k">+250k</button>
            <button id="set-1m">1M Cap</button>
            <button id="set-2m">2M Cap</button>
            <button id="reset-btn" class="reset-btn">Reset</button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const root = this.shadowRoot;
    if (!root) return;

    root.getElementById('add-10k')?.addEventListener('click', () => this.consumeTokens(10000));
    root.getElementById('add-50k')?.addEventListener('click', () => this.consumeTokens(50000));
    root.getElementById('add-250k')?.addEventListener('click', () => this.consumeTokens(250000));
    root.getElementById('set-1m')?.addEventListener('click', () => this.setLimit(1000000));
    root.getElementById('set-2m')?.addEventListener('click', () => this.setLimit(2000000));
    root.getElementById('reset-btn')?.addEventListener('click', () => this.resetTokens());
  }
}

customElements.define('token-budget-widget', TokenBudgetWidget);
export default TokenBudgetWidget;
