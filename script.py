# Let's start by importing necessary libraries and setting up the foundation for our dashboard
# We'll need libraries for:
# 1. Data retrieval and manipulation
# 2. Factor model regression
# 3. Portfolio optimization
# 4. Dashboard creation

print("Installing necessary packages...\nThis may take a minute...")

!pip install -q yfinance pandas-datareader pandas numpy scipy plotly scikit-learn
!pip install -q streamlit

print("Packages installed successfully.")

import pandas as pd
import numpy as np
import yfinance as yf
from pandas_datareader import data as pdr
import pandas_datareader.famafrench as ff
import datetime
import scipy.optimize as sco
import matplotlib.pyplot as plt

# Setting up variables for later use
print("Defining a list of liquid U.S. stocks and ETFs")
tickers = [
    # Major ETFs
    'SPY', 'QQQ', 'IWM', 'VTI', 'VOO', 'VEA', 'VWO', 'AGG', 'BND', 'VTV', 'VUG',
    # Large Cap Stocks 
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK-B', 'JNJ', 'V', 'PG',
    # Additional sectors for diversification
    'XLF', 'XLE', 'XLK', 'XLV', 'XLU', 'XLI', 'XLP', 'XLY'
]

print(f"Selected {len(tickers)} stocks and ETFs for portfolio optimization.")

# Define a function to download historical price data
def get_stock_data(tickers, start_date, end_date):
    """
    Download adjusted close prices for the specified tickers and date range
    """
    print(f"Downloading price data for {len(tickers)} assets...")
    try:
        yf.pdr_override()
        data = pdr.get_data_yahoo(tickers, start=start_date, end=end_date)['Adj Close']
        print(f"Successfully downloaded data with shape: {data.shape}")
        return data
    except Exception as e:
        print(f"Error downloading data: {e}")
        return None

# Define a function to download Fama-French factor data
def get_ff_factors(start_date, end_date):
    """
    Download Fama-French factor data for the specified date range
    """
    print("Downloading Fama-French factor data...")
    try:
        # Get the FF 5 factors data (includes the 4 factors we need: Mkt-RF, SMB, HML, RMW)
        ff_data = ff.FamaFrenchReader('F-F_Research_Data_5_Factors_2x3', start=start_date, end=end_date).read()[0]
        # Convert index to datetime
        ff_data.index = pd.to_datetime(ff_data.index, format='%Y-%m')
        print(f"Successfully downloaded FF factor data with shape: {ff_data.shape}")
        return ff_data
    except Exception as e:
        print(f"Error downloading FF factor data: {e}")
        return None

# Check the available FF datasets
print("Available Fama-French datasets:")
try:
    available_datasets = ff.get_available_datasets()
    # Print first 10 datasets
    for i, dataset in enumerate(available_datasets[:10]):
        print(f"{i+1}. {dataset}")
    print("...")
except Exception as e:
    print(f"Error getting available datasets: {e}")

# Sample implementation of a function to compute factor betas
def compute_factor_betas(returns, factors):
    """
    Compute factor betas (exposures) for each asset using linear regression
    
    Parameters:
    returns (DataFrame): Monthly returns for each asset
    factors (DataFrame): Monthly Fama-French factor returns
    
    Returns:
    DataFrame: Factor betas for each asset
    """
    from sklearn.linear_model import LinearRegression
    
    # Initialize a DataFrame to store the betas
    betas = pd.DataFrame(index=returns.columns, 
                         columns=factors.columns)
    
    # For each asset, run a regression against the factors
    for asset in returns.columns:
        # Prepare the data
        y = returns[asset].values.reshape(-1, 1)
        X = factors.values
        
        # Run the regression
        model = LinearRegression().fit(X, y)
        
        # Store the coefficients (betas)
        betas.loc[asset] = model.coef_[0]
    
    return betas

# Sample function to optimize a portfolio to match target factor exposures
def optimize_portfolio(returns, betas, target_exposures, constraints=None):
    """
    Optimize a portfolio to minimize tracking error to target factor exposures
    
    Parameters:
    returns (DataFrame): Monthly returns for each asset
    betas (DataFrame): Factor betas for each asset
    target_exposures (Series): Target factor exposures
    constraints (dict): Additional constraints for the optimization
    
    Returns:
    array: Optimized portfolio weights
    """
    n_assets = len(returns.columns)
    
    # Define the objective function (minimize squared error between portfolio exposures and targets)
    def objective(weights):
        # Calculate portfolio factor exposures
        portfolio_exposures = betas.T @ weights
        
        # Calculate squared error
        tracking_error = np.sum((portfolio_exposures - target_exposures)**2)
        
        return tracking_error
    
    # Initial weights (equal allocation)
    initial_weights = np.array([1.0/n_assets] * n_assets)
    
    # Define constraints
    if constraints is None:
        constraints = {}
    
    # Default constraints
    constraints_list = [
        {'type': 'eq', 'fun': lambda x: np.sum(x) - 1.0},  # Sum of weights = 1
        {'type': 'ineq', 'fun': lambda x: x}  # All weights >= 0 (no shorting)
    ]
    
    # Add any additional constraints
    
    # Run the optimization
    result = sco.minimize(objective, initial_weights, method='SLSQP',
                          constraints=constraints_list, bounds=[(0, 1) for _ in range(n_assets)])
    
    if result['success']:
        return result['x']
    else:
        print("Optimization failed:", result['message'])
        return initial_weights

print("Functions defined successfully.")

# Define date ranges for demonstration
end_date = datetime.datetime.now()
start_date = end_date - datetime.timedelta(days=365*5)  # 5 years of data

print(f"Date range: {start_date.date()} to {end_date.date()}")

print("This setup provides the foundation for building the dashboard. Next steps would include:")
print("1. Downloading and processing the stock and factor data")
print("2. Computing factor betas through regression")
print("3. Setting up the portfolio optimization")
print("4. Creating the Streamlit dashboard interface")