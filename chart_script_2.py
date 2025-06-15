import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
iterations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
tracking_error = [0.85, 0.72, 0.61, 0.54, 0.48, 0.44, 0.41, 0.38, 0.36, 0.34, 0.33, 0.32, 0.31, 0.31, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30]

# Create the line chart
fig = go.Figure()

# Add the line trace with smooth curve
fig.add_trace(go.Scatter(
    x=iterations,
    y=tracking_error,
    mode='lines',
    line=dict(shape='spline', color='#1FB8CD', width=3),
    name='Tracking Error',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Tracking Error Convergence',
    xaxis_title='Iteration',
    yaxis_title='Tracking Error',
    showlegend=False,
    xaxis=dict(showgrid=True),
    yaxis=dict(showgrid=True)
)

# Save the chart
fig.write_image('tracking_error_convergence.png')