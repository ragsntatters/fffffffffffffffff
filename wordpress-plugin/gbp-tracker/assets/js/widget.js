jQuery(document).ready(function($) {
    // Initialize widget
    function initGBPTrackerWidget() {
        const widgets = document.querySelectorAll('#gbp-tracker-widget');
        
        widgets.forEach(widget => {
            const theme = widget.dataset.theme || 'light';
            widget.classList.add(`gbp-tracker-widget`, `theme-${theme}`);
            
            // Initialize widget UI
            renderWidgetUI(widget);
        });
    }

    function renderWidgetUI(container) {
        // Create widget structure
        const widgetHTML = `
            <div class="gbp-tracker-search">
                <input type="text" placeholder="Search for your business..." class="business-search" />
                <div class="search-results"></div>
            </div>
            <div class="audit-form" style="display: none;">
                <input type="text" placeholder="Enter keyword" class="keyword-input" />
                <select class="grid-size">
                    <option value="3x3">3x3 Grid</option>
                    <option value="5x5">5x5 Grid</option>
                    <option value="7x7">7x7 Grid</option>
                </select>
                <div class="radius-group">
                    <input type="number" placeholder="Radius" class="radius-input" />
                    <select class="radius-unit">
                        <option value="km">Kilometers</option>
                        <option value="mi">Miles</option>
                    </select>
                </div>
                <button class="run-audit">Run Free Audit</button>
            </div>
            <div class="audit-results" style="display: none;"></div>
        `;
        
        container.innerHTML = widgetHTML;
        
        // Add event listeners
        setupEventListeners(container);
    }

    function setupEventListeners(container) {
        const searchInput = container.querySelector('.business-search');
        const searchResults = container.querySelector('.search-results');
        const auditForm = container.querySelector('.audit-form');
        const auditButton = container.querySelector('.run-audit');
        
        // Debounce search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchBusiness(e.target.value, searchResults);
            }, 300);
        });
        
        // Run audit
        auditButton.addEventListener('click', () => {
            const keyword = container.querySelector('.keyword-input').value;
            const gridSize = container.querySelector('.grid-size').value;
            const radius = container.querySelector('.radius-input').value;
            const unit = container.querySelector('.radius-unit').value;
            
            runAudit({
                keyword,
                gridSize,
                radius,
                unit,
                locationId: container.dataset.location
            }, container);
        });
    }

    async function searchBusiness(query, resultsContainer) {
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        try {
            const response = await fetch(`${gbpTrackerConfig.apiUrl}/search`, {
                headers: {
                    'X-API-Key': gbpTrackerConfig.apiKey
                }
            });
            
            const results = await response.json();
            
            resultsContainer.innerHTML = results.map(business => `
                <div class="search-result" data-id="${business.id}">
                    <strong>${business.name}</strong>
                    <p>${business.address}</p>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Search failed:', error);
            resultsContainer.innerHTML = '<div class="error">Search failed. Please try again.</div>';
        }
    }

    async function runAudit(data, container) {
        const resultsDiv = container.querySelector('.audit-results');
        resultsDiv.innerHTML = '<div class="loading">Running audit...</div>';
        resultsDiv.style.display = 'block';
        
        try {
            const response = await fetch(`${gbpTrackerConfig.apiUrl}/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': gbpTrackerConfig.apiKey
                },
                body: JSON.stringify(data)
            });
            
            const results = await response.json();
            displayAuditResults(results, resultsDiv);
            
        } catch (error) {
            console.error('Audit failed:', error);
            resultsDiv.innerHTML = '<div class="error">Audit failed. Please try again.</div>';
        }
    }

    function displayAuditResults(results, container) {
        // Display audit results UI
        container.innerHTML = `
            <div class="audit-summary">
                <h3>Audit Results</h3>
                <div class="metrics">
                    <div class="metric">
                        <label>Current Rank</label>
                        <span>#${results.rank}</span>
                    </div>
                    <div class="metric">
                        <label>AGR Score</label>
                        <span>${results.avgAGR}%</span>
                    </div>
                    <div class="metric">
                        <label>Visibility Score</label>
                        <span>${results.visibility}%</span>
                    </div>
                </div>
                <button class="view-full-report" onclick="window.location.href='${results.reportUrl}'">
                    View Full Report
                </button>
            </div>
        `;
    }

    // Initialize widgets when document is ready
    initGBPTrackerWidget();
});