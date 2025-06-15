import plotly.graph_objects as go
import plotly.io as pio

# Data
factors = ["Market (MKT-RF)", "Size (SMB)", "Value (HML)", "Profitability (RMW)"]
target = [1.0, 0.2, 0.1, 0.15]
portfolio = [0.98, 0.18, 0.12, 0.14]

# Shorten factor names to fit 15 character limit
factors_short = ["MKT-RF", "SMB", "HML", "RMW"]

# Create grouped bar chart
fig = go.Figure()

# Add target exposures bar
fig.add_trace(go.Bar(
    x=factors_short,
    y=target,
    name='Target',
    marker_color='#1FB8CD',
    cliponaxis=False
))

# Add portfolio exposures bar
fig.add_trace(go.Bar(
    x=factors_short,
    y=portfolio,
    name='Portfolio',
    marker_color='#FFC185',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Factor Exposure: Target vs Portfolio",
    xaxis_title="FF Factors",
    yaxis_title="Factor Exposure",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image("factor_exposure_chart.png")