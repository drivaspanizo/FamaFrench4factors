import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
metrics = ["Tracking Error", "Diversification Ratio", "Effective Assets", "Max Single Weight", "R-Squared"]
values = [0.045, 0.82, 8.5, 0.25, 0.75]

# Abbreviate metric names to meet 15 character limit
abbreviated_metrics = [
    "Track Error",      # 11 chars
    "Diversif Ratio",   # 15 chars
    "Effect Assets",    # 13 chars
    "Max Sngl Weight",  # 15 chars
    "R-Squared"         # 9 chars
]

# Brand colors in order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C']

# Create horizontal bar chart
fig = go.Figure(data=go.Bar(
    y=abbreviated_metrics,
    x=values,
    orientation='h',
    marker_color=colors,
    text=[f'{val}' for val in values],
    textposition='outside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Portfolio Performance Metrics",
    xaxis_title="Value",
    yaxis_title="Metric"
)

# Save the chart
fig.write_image("portfolio_metrics.png")
fig.show()