import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Data from the provided JSON
assets = ["SPY", "IWM", "XLF", "XLV", "VTV", "MSFT", "AAPL", "XLE", "XLI", "JNJ"]
weights = [0.05, 0.15, 0.12, 0.08, 0.20, 0.07, 0.06, 0.10, 0.11, 0.06]

# Create DataFrame and sort by weights (largest to smallest)
df = pd.DataFrame({'Asset': assets, 'Weight': weights})
df_sorted = df.sort_values('Weight', ascending=False)

# Convert weights to percentages for display
df_sorted['Percentage'] = df_sorted['Weight'] * 100

# Define the brand colors in order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', 
          '#B4413C', '#964325', '#944454', '#13343B', '#DB4545']

# Create pie chart
fig = go.Figure(data=[go.Pie(
    labels=df_sorted['Asset'], 
    values=df_sorted['Weight'],
    marker_colors=colors,
    textinfo='label+percent',
    textposition='inside'
)])

# Update layout with pie chart specific settings
fig.update_layout(
    title="Optimal Portfolio Allocation",
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Save the chart
fig.write_image("portfolio_allocation.png")