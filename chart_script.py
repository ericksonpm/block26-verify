import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

# Create the data
data = [
    {"Group": "Group I-AD", "Description": "Career + 30%+ disabled veteran", "Protection_Level": 10, "Category": "Highest"},
    {"Group": "Group I-A", "Description": "Career + other veterans preference", "Protection_Level": 9, "Category": "High"},
    {"Group": "Group I-B", "Description": "Career + no veterans preference", "Protection_Level": 8, "Category": "High"},
    {"Group": "Group II-AD", "Description": "Conditional + 30%+ disabled veteran", "Protection_Level": 7, "Category": "Moderate"},
    {"Group": "Group II-A", "Description": "Conditional + other veterans preference", "Protection_Level": 6, "Category": "Moderate"},
    {"Group": "Group II-B", "Description": "Conditional + no veterans preference", "Protection_Level": 5, "Category": "Moderate"},
    {"Group": "Group III-AD", "Description": "Temporary + 30%+ disabled veteran", "Protection_Level": 4, "Category": "Lower"},
    {"Group": "Group III-A", "Description": "Temporary + other veterans preference", "Protection_Level": 3, "Category": "Lower"},
    {"Group": "Group III-B", "Description": "Temporary + no veterans preference", "Protection_Level": 2, "Category": "Lowest"}
]

df = pd.DataFrame(data)

# Create better labels under 15 char limit
df['Label'] = df['Group'].str.replace('Group ', '') + '<br>' + df['Description'].str.replace('Career', 'Career').str.replace('Conditional', 'Conditional').str.replace('Temporary', 'Temporary').str.replace('veterans preference', 'vet pref').str.replace('disabled veteran', 'disabled vet').str.replace(' + ', ' + ').str.replace('other ', '')

# Use individual colors for each protection level for better distinction
colors = ['#8B0000',  # Dark red - lowest
          '#DC143C',  # Crimson
          '#FF4500',  # Orange red  
          '#FF8C00',  # Dark orange
          '#FFD700',  # Gold
          '#ADFF2F',  # Green yellow
          '#32CD32',  # Lime green
          '#228B22',  # Forest green
          '#006400',  # Dark green
          '#004225']  # Very dark green - highest

# Sort by protection level (lowest to highest for proper y-axis order)
df_sorted = df.sort_values('Protection_Level', ascending=True)

# Create horizontal bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=df_sorted['Protection_Level'],
    y=df_sorted['Label'],
    orientation='h',
    marker=dict(
        color=[colors[level-1] for level in df_sorted['Protection_Level']],
        line=dict(width=1, color='white')
    ),
    hovertemplate='<b>%{y}</b><br>Protection: %{x}<extra></extra>'
))

# Update layout
fig.update_layout(
    title='Federal RIF Protection Hierarchy',
    xaxis_title='RIF Protect Lvl',  # Under 15 chars
    yaxis_title='Tenure Groups',    # Under 15 chars
    showlegend=False,
    xaxis=dict(range=[0, 10], dtick=1, showgrid=False),
    yaxis=dict(autorange='reversed', showgrid=False)  # This puts highest protection at top
)

# Save the chart
fig.write_image('rif_protection_chart.png')