# Fama-French 4-Factor Portfolio Optimizer

## Overview

This interactive web dashboard constructs optimized portfolios of stocks and ETFs to match user-defined target exposures to the Fama-French 4-Factor Model. The application implements constrained quadratic optimization to minimize tracking error between portfolio factor exposures and target exposures.

## 🚀 Features

### 📊 Interactive Controls
- **Target Factor Exposure Sliders**:
  - Market (MKT-RF): 0.0 to 2.0 (default: 1.0)
  - Size (SMB): -0.5 to 0.5 (default: 0.1)
  - Value (HML): -0.5 to 0.5 (default: 0.1)
  - Profitability (RMW): -0.3 to 0.3 (default: 0.1)

- **Portfolio Constraints**:
  - Maximum weight per asset (5% to 100%, default: 25%)
  - Minimum weight per asset (0% to 10%, default: 0%)
  - No shorting constraint (weights ≥ 0)
  - Fully invested constraint (weights sum to 1)

### 📈 Optimization Engine
- **Asset Universe**: 30 liquid U.S. stocks and ETFs including:
  - Broad market ETFs (SPY, QQQ, IWM, VTI, VOO)
  - Individual large-cap stocks (AAPL, MSFT, GOOGL, AMZN, META)
  - Sector ETFs (XLF, XLE, XLK, XLV, XLU, XLI, XLP, XLY)

- **Optimization Objective**:
  ```
  minimize: Σ(βportfolio,f - βtarget,f)²
  ```
  Where β represents factor exposures for each factor f

### 📊 Results Visualization
- **Portfolio Allocation**: Interactive pie chart showing optimal weights
- **Factor Exposure Analysis**: Bar chart comparing target vs portfolio exposures
- **Performance Metrics**: Tracking error, diversification ratio, effective number of assets
- **Export Functionality**: Download portfolio weights as CSV

## 🧮 Mathematical Foundation

### Factor Model
The Fama-French 4-Factor Model explains asset returns using:

**R(i,t) - RF(t) = α(i) + β(i,MKT) × [RM(t) - RF(t)] + β(i,SMB) × SMB(t) + β(i,HML) × HML(t) + β(i,RMW) × RMW(t) + ε(i,t)**

Where:
- **MKT-RF**: Market risk premium (systematic risk)
- **SMB**: Small Minus Big (size factor)
- **HML**: High Minus Low book-to-market (value factor)
- **RMW**: Robust Minus Weak profitability (quality factor)

### Portfolio Optimization
The optimization problem is formulated as:

**Objective Function**:
```
min Σf [Σi wi × βi,f - βtarget,f]²
```

**Subject to constraints**:
- Σi wi = 1 (fully invested)
- wi ≥ wmin (minimum weight)
- wi ≤ wmax (maximum weight)

## 📚 Factor Interpretations

### Market Factor (MKT-RF)
- **Definition**: Excess return of market portfolio over risk-free rate
- **Interpretation**: 
  - 1.0 = market-neutral exposure
  - > 1.0 = more aggressive than market
  - < 1.0 = more defensive than market

### Size Factor (SMB)
- **Definition**: Small Minus Big market capitalization
- **Interpretation**:
  - Positive = tilt toward small-cap stocks
  - Negative = tilt toward large-cap stocks
  - Historical small-cap premium justification

### Value Factor (HML)
- **Definition**: High Minus Low book-to-market ratio
- **Interpretation**:
  - Positive = value stock tilt
  - Negative = growth stock tilt
  - Value premium over growth stocks

### Profitability Factor (RMW)
- **Definition**: Robust Minus Weak operating profitability
- **Interpretation**:
  - Positive = quality/profitable companies tilt
  - Captures operational efficiency premium
  - Added by Fama-French in 2015 five-factor model

## 🔧 Technical Implementation

### Data Sources
- **Factor Betas**: Pre-computed using linear regression on historical data
- **Asset Universe**: 30 liquid U.S. stocks and ETFs
- **Sample Data**: Realistic factor loadings for demonstration

### Optimization Algorithm
- **Method**: Sequential Least Squares Programming (SLSQP)
- **Convergence**: Iterative improvement until optimal solution
- **Constraints**: Linear equality and inequality constraints

### Performance Metrics
- **Tracking Error**: √Σ(βportfolio,f - βtarget,f)²
- **Diversification Ratio**: 1 - Σwi²
- **Effective Number of Assets**: 1 / Σwi²

## 🎯 Usage Instructions

1. **Set Target Exposures**: Use sliders to define desired factor exposures
2. **Configure Constraints**: Set maximum and minimum weights per asset
3. **Optimize Portfolio**: Click "Optimize Portfolio" to run optimization
4. **Analyze Results**: Review allocation pie chart and factor exposure comparison
5. **Export Data**: Download portfolio weights as CSV file

## 📊 Example Results

A typical optimization with target exposures [MKT-RF: 1.0, SMB: 0.2, HML: 0.1, RMW: 0.15] might produce:

- **Top Holdings**: VTV (20%), IWM (15%), XLF (12%), XLI (11%), XLE (10%)
- **Tracking Error**: 0.045
- **Diversification Ratio**: 0.82
- **Effective Assets**: 8.5

## 🚀 Deployment

The dashboard is built as a single-page web application using:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js for interactive visualizations
- **Optimization**: Custom JavaScript implementation
- **Responsive**: Mobile-friendly design

## 📈 Future Enhancements

- Real-time data integration (Yahoo Finance API)
- Additional factor models (Fama-French 5-factor, Q-factor)
- Backtesting functionality
- Risk attribution analysis
- Monte Carlo simulation capabilities

## 📖 References

- Fama, E. F., & French, K. R. (1993). Common risk factors in the returns on stocks and bonds.
- Fama, E. F., & French, K. R. (2015). A five-factor asset pricing model.
- Carhart, M. M. (1997). On persistence in mutual fund performance.

---

**Built for**: Portfolio optimization and factor investing education  
**Target Users**: Investment professionals, researchers, students  
**Technology**: Modern web standards with financial mathematics