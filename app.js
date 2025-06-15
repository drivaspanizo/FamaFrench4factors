// Fama-French 4-Factor Portfolio Optimizer JavaScript

// Asset data
const ASSET_DATA = {
    tickers: ["SPY", "QQQ", "IWM", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "JNJ", "V", "PG", "JPM", "UNH", "HD", "BAC", "NVDA", "MA", "DIS", "ADBE", "XLF", "XLE", "XLK", "XLV", "XLU", "XLI", "XLP", "XLY", "VTI", "VOO"],
    factorBetas: {
        "SPY": {"MktRF": 1.00, "SMB": -0.05, "HML": 0.02, "RMW": 0.03},
        "QQQ": {"MktRF": 1.15, "SMB": -0.20, "HML": -0.25, "RMW": 0.08},
        "IWM": {"MktRF": 1.25, "SMB": 0.85, "HML": 0.15, "RMW": -0.05},
        "AAPL": {"MktRF": 1.20, "SMB": -0.30, "HML": -0.15, "RMW": 0.25},
        "MSFT": {"MktRF": 1.10, "SMB": -0.25, "HML": -0.10, "RMW": 0.30},
        "GOOGL": {"MktRF": 1.25, "SMB": -0.15, "HML": -0.20, "RMW": 0.20},
        "AMZN": {"MktRF": 1.35, "SMB": -0.10, "HML": -0.30, "RMW": 0.15},
        "META": {"MktRF": 1.40, "SMB": -0.05, "HML": -0.25, "RMW": 0.10},
        "TSLA": {"MktRF": 1.80, "SMB": 0.20, "HML": -0.35, "RMW": -0.10},
        "JNJ": {"MktRF": 0.70, "SMB": -0.40, "HML": 0.20, "RMW": 0.35},
        "V": {"MktRF": 1.05, "SMB": -0.30, "HML": -0.05, "RMW": 0.40},
        "PG": {"MktRF": 0.65, "SMB": -0.45, "HML": 0.25, "RMW": 0.30},
        "JPM": {"MktRF": 1.30, "SMB": -0.20, "HML": 0.30, "RMW": 0.10},
        "UNH": {"MktRF": 0.85, "SMB": -0.35, "HML": 0.15, "RMW": 0.25},
        "HD": {"MktRF": 1.15, "SMB": -0.25, "HML": 0.10, "RMW": 0.20},
        "BAC": {"MktRF": 1.45, "SMB": -0.15, "HML": 0.35, "RMW": 0.05},
        "NVDA": {"MktRF": 1.60, "SMB": 0.10, "HML": -0.40, "RMW": 0.15},
        "MA": {"MktRF": 1.00, "SMB": -0.30, "HML": -0.10, "RMW": 0.35},
        "DIS": {"MktRF": 1.20, "SMB": -0.20, "HML": 0.05, "RMW": 0.00},
        "ADBE": {"MktRF": 1.30, "SMB": -0.10, "HML": -0.20, "RMW": 0.25},
        "XLF": {"MktRF": 1.25, "SMB": -0.10, "HML": 0.40, "RMW": 0.05},
        "XLE": {"MktRF": 1.35, "SMB": 0.05, "HML": 0.45, "RMW": -0.15},
        "XLK": {"MktRF": 1.20, "SMB": -0.25, "HML": -0.30, "RMW": 0.20},
        "XLV": {"MktRF": 0.80, "SMB": -0.30, "HML": 0.15, "RMW": 0.25},
        "XLU": {"MktRF": 0.60, "SMB": -0.20, "HML": 0.30, "RMW": 0.10},
        "XLI": {"MktRF": 1.10, "SMB": 0.00, "HML": 0.20, "RMW": 0.15},
        "XLP": {"MktRF": 0.70, "SMB": -0.35, "HML": 0.25, "RMW": 0.20},
        "XLY": {"MktRF": 1.25, "SMB": -0.05, "HML": -0.05, "RMW": 0.10},
        "VTI": {"MktRF": 1.00, "SMB": 0.05, "HML": 0.00, "RMW": 0.05},
        "VOO": {"MktRF": 1.00, "SMB": -0.10, "HML": 0.00, "RMW": 0.05}
    }
};

// Global variables
let allocationChart = null;
let exposureChart = null;
let currentResults = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeEventListeners();
});

// Initialize slider interactions
function initializeSliders() {
    const sliders = [
        { id: 'mktrf-slider', valueId: 'mktrf-value' },
        { id: 'smb-slider', valueId: 'smb-value' },
        { id: 'hml-slider', valueId: 'hml-value' },
        { id: 'rmw-slider', valueId: 'rmw-value' },
        { id: 'max-weight', valueId: 'max-weight-value' },
        { id: 'min-weight', valueId: 'min-weight-value' }
    ];

    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueElement = document.getElementById(slider.valueId);
        
        element.addEventListener('input', function() {
            valueElement.textContent = this.value;
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    document.getElementById('optimize-btn').addEventListener('click', optimizePortfolio);
    document.getElementById('toggle-education').addEventListener('click', toggleEducation);
    document.getElementById('export-btn').addEventListener('click', exportResults);
}

// Toggle education section
function toggleEducation() {
    const content = document.getElementById('education-content');
    const button = document.getElementById('toggle-education');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = 'Hide Details';
    } else {
        content.style.display = 'none';
        button.textContent = 'Show Details';
    }
}

// Portfolio optimization function
async function optimizePortfolio() {
    // Show loading state
    document.getElementById('initial-state').style.display = 'none';
    document.getElementById('results-content').style.display = 'none';
    document.getElementById('loading-state').style.display = 'flex';

    // Get target exposures and constraints
    const targets = {
        MktRF: parseFloat(document.getElementById('mktrf-slider').value),
        SMB: parseFloat(document.getElementById('smb-slider').value),
        HML: parseFloat(document.getElementById('hml-slider').value),
        RMW: parseFloat(document.getElementById('rmw-slider').value)
    };

    const constraints = {
        maxWeight: parseFloat(document.getElementById('max-weight').value) / 100,
        minWeight: parseFloat(document.getElementById('min-weight').value) / 100
    };

    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Run optimization algorithm
        const results = runOptimization(targets, constraints);
        currentResults = results;

        // Update UI with results
        updateResults(results, targets);

        // Show results
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('results-content').style.display = 'block';

    } catch (error) {
        console.error('Optimization failed:', error);
        document.getElementById('loading-state').style.display = 'none';
        alert('Optimization failed. Please try different parameters.');
    }
}

// Optimization algorithm using iterative approach
function runOptimization(targets, constraints) {
    const tickers = ASSET_DATA.tickers;
    const betas = ASSET_DATA.factorBetas;
    const n = tickers.length;
    
    // Initialize equal weights
    let weights = new Array(n).fill(1 / n);
    
    // Optimization parameters
    const maxIterations = 1000;
    const learningRate = 0.01;
    const tolerance = 1e-6;
    
    for (let iter = 0; iter < maxIterations; iter++) {
        // Calculate current portfolio exposures
        const currentExposures = calculatePortfolioExposures(weights, tickers, betas);
        
        // Calculate gradients
        const gradients = calculateGradients(weights, tickers, betas, targets, currentExposures);
        
        // Update weights
        const newWeights = [...weights];
        for (let i = 0; i < n; i++) {
            newWeights[i] -= learningRate * gradients[i];
        }
        
        // Apply constraints
        applyConstraints(newWeights, constraints);
        
        // Check convergence
        const diff = weights.reduce((sum, w, i) => sum + Math.abs(w - newWeights[i]), 0);
        weights = newWeights;
        
        if (diff < tolerance) break;
    }
    
    // Filter out zero weights for cleaner results
    const filteredResults = [];
    for (let i = 0; i < n; i++) {
        if (weights[i] > 0.001) { // Only include weights > 0.1%
            filteredResults.push({
                ticker: tickers[i],
                weight: weights[i],
                betas: betas[tickers[i]]
            });
        }
    }
    
    // Sort by weight descending
    filteredResults.sort((a, b) => b.weight - a.weight);
    
    return {
        assets: filteredResults,
        exposures: calculatePortfolioExposures(weights, tickers, betas),
        trackingError: calculateTrackingError(weights, tickers, betas, targets)
    };
}

// Calculate portfolio factor exposures
function calculatePortfolioExposures(weights, tickers, betas) {
    const exposures = { MktRF: 0, SMB: 0, HML: 0, RMW: 0 };
    
    for (let i = 0; i < weights.length; i++) {
        const tickerBetas = betas[tickers[i]];
        exposures.MktRF += weights[i] * tickerBetas.MktRF;
        exposures.SMB += weights[i] * tickerBetas.SMB;
        exposures.HML += weights[i] * tickerBetas.HML;
        exposures.RMW += weights[i] * tickerBetas.RMW;
    }
    
    return exposures;
}

// Calculate gradients for optimization
function calculateGradients(weights, tickers, betas, targets, currentExposures) {
    const n = weights.length;
    const gradients = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        const tickerBetas = betas[tickers[i]];
        
        // Gradient of squared error with respect to weight i
        gradients[i] = 2 * (
            (currentExposures.MktRF - targets.MktRF) * tickerBetas.MktRF +
            (currentExposures.SMB - targets.SMB) * tickerBetas.SMB +
            (currentExposures.HML - targets.HML) * tickerBetas.HML +
            (currentExposures.RMW - targets.RMW) * tickerBetas.RMW
        );
    }
    
    return gradients;
}

// Apply portfolio constraints
function applyConstraints(weights, constraints) {
    const n = weights.length;
    
    // Apply min/max weight constraints
    for (let i = 0; i < n; i++) {
        weights[i] = Math.max(constraints.minWeight, Math.min(constraints.maxWeight, weights[i]));
    }
    
    // Normalize to sum to 1
    const sum = weights.reduce((s, w) => s + w, 0);
    if (sum > 0) {
        for (let i = 0; i < n; i++) {
            weights[i] /= sum;
        }
    }
}

// Calculate tracking error
function calculateTrackingError(weights, tickers, betas, targets) {
    const exposures = calculatePortfolioExposures(weights, tickers, betas);
    
    const error = Math.sqrt(
        Math.pow(exposures.MktRF - targets.MktRF, 2) +
        Math.pow(exposures.SMB - targets.SMB, 2) +
        Math.pow(exposures.HML - targets.HML, 2) +
        Math.pow(exposures.RMW - targets.RMW, 2)
    );
    
    return error;
}

// Update UI with optimization results
function updateResults(results, targets) {
    updateAllocationChart(results.assets);
    updateExposureChart(results.exposures, targets);
    updateWeightsTable(results.assets);
    updateExposureTable(results.exposures, targets);
    updateMetrics(results);
}

// Update allocation pie chart
function updateAllocationChart(assets) {
    const ctx = document.getElementById('allocation-chart').getContext('2d');
    
    if (allocationChart) {
        allocationChart.destroy();
    }
    
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    
    allocationChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: assets.map(a => a.ticker),
            datasets: [{
                data: assets.map(a => a.weight * 100),
                backgroundColor: colors.slice(0, assets.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: ${data.datasets[0].data[i].toFixed(1)}%`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].borderColor,
                                lineWidth: data.datasets[0].borderWidth
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Update factor exposure comparison chart
function updateExposureChart(exposures, targets) {
    const ctx = document.getElementById('exposure-chart').getContext('2d');
    
    if (exposureChart) {
        exposureChart.destroy();
    }
    
    const factors = ['MktRF', 'SMB', 'HML', 'RMW'];
    const targetData = factors.map(f => targets[f]);
    const portfolioData = factors.map(f => exposures[f]);
    
    exposureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Market', 'Size', 'Value', 'Profitability'],
            datasets: [
                {
                    label: 'Target',
                    data: targetData,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                },
                {
                    label: 'Portfolio',
                    data: portfolioData,
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Factor Exposure'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            }
        }
    });
}

// Update portfolio weights table
function updateWeightsTable(assets) {
    const tbody = document.querySelector('#weights-table tbody');
    tbody.innerHTML = '';
    
    assets.forEach(asset => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = asset.ticker;
        row.insertCell(1).textContent = (asset.weight * 100).toFixed(2) + '%';
        row.insertCell(2).textContent = asset.betas.MktRF.toFixed(3);
        row.insertCell(3).textContent = asset.betas.SMB.toFixed(3);
        row.insertCell(4).textContent = asset.betas.HML.toFixed(3);
        row.insertCell(5).textContent = asset.betas.RMW.toFixed(3);
    });
}

// Update factor exposure table
function updateExposureTable(exposures, targets) {
    const tbody = document.querySelector('#exposure-table tbody');
    tbody.innerHTML = '';
    
    const factors = [
        { key: 'MktRF', name: 'Market (MKT-RF)' },
        { key: 'SMB', name: 'Size (SMB)' },
        { key: 'HML', name: 'Value (HML)' },
        { key: 'RMW', name: 'Profitability (RMW)' }
    ];
    
    factors.forEach(factor => {
        const row = tbody.insertRow();
        const target = targets[factor.key];
        const portfolio = exposures[factor.key];
        const difference = portfolio - target;
        const squaredError = Math.pow(difference, 2);
        
        row.insertCell(0).textContent = factor.name;
        row.insertCell(1).textContent = target.toFixed(3);
        row.insertCell(2).textContent = portfolio.toFixed(3);
        
        const diffCell = row.insertCell(3);
        diffCell.textContent = difference.toFixed(3);
        diffCell.className = difference > 0 ? 'positive-diff' : difference < 0 ? 'negative-diff' : '';
        
        row.insertCell(4).textContent = squaredError.toFixed(6);
    });
}

// Update performance metrics
function updateMetrics(results) {
    document.getElementById('tracking-error').textContent = results.trackingError.toFixed(4);
    
    // Calculate effective number of assets (inverse of sum of squared weights)
    const sumSquaredWeights = results.assets.reduce((sum, asset) => sum + Math.pow(asset.weight, 2), 0);
    const effectiveAssets = 1 / sumSquaredWeights;
    document.getElementById('effective-assets').textContent = effectiveAssets.toFixed(1);
    
    // Max weight achieved
    const maxWeight = Math.max(...results.assets.map(a => a.weight));
    document.getElementById('max-weight-achieved').textContent = (maxWeight * 100).toFixed(1) + '%';
    
    // Diversification ratio (simplified)
    const diversificationRatio = results.assets.length / effectiveAssets;
    document.getElementById('diversification-ratio').textContent = diversificationRatio.toFixed(2);
}

// Export results to CSV
function exportResults() {
    if (!currentResults) return;
    
    let csv = 'Asset,Weight (%),Market Beta,Size Beta,Value Beta,Profitability Beta\n';
    
    currentResults.assets.forEach(asset => {
        csv += `${asset.ticker},${(asset.weight * 100).toFixed(2)},${asset.betas.MktRF.toFixed(3)},${asset.betas.SMB.toFixed(3)},${asset.betas.HML.toFixed(3)},${asset.betas.RMW.toFixed(3)}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-weights.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}