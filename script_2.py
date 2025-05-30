# Create a comprehensive reference table for SF-50 Block codes
import pandas as pd

# Create the data
data = []

# Block 23 codes
data.extend([
    ['23', '1', 'None - No Veterans Preference', 'Subgroup B (lowest protection)'],
    ['23', '2', '5-point preference (TP)', 'Subgroup A (moderate protection)'],
    ['23', '3', '10-point/disability (XP)', 'Subgroup A (moderate protection)'],
    ['23', '4', '10-point/compensable (CP)', 'Subgroup A (moderate protection)'],
    ['23', '5', '10-point/other (XP)', 'Subgroup A (moderate protection)'],
    ['23', '6', '10-point compensable/30%+ (CPS)', 'Subgroup AD (highest protection)'],
    ['23', '7', 'No points/Sole Survivorship Preference (SSP)', 'Subgroup A (moderate protection)']
])

# Block 24 codes
data.extend([
    ['24', '1', 'Career employee - completed 3+ years qualifying service', 'Tenure Group I (highest protection)'],
    ['24', '2', 'Career-conditional - less than 3 years or on probation', 'Tenure Group II (moderate protection)'],
    ['24', '3', 'Temporary, term, or time-limited appointment', 'Tenure Group III (lowest protection)']
])

# Block 26 codes
data.extend([
    ['26', 'Yes/Checked', 'Eligible for Veterans Preference in RIF', 'Eligible for veterans subgroup placement'],
    ['26', 'No/Blank', 'Not eligible for Veterans Preference in RIF', 'Placed in Subgroup B regardless of veteran status']
])

# Create DataFrame
df = pd.DataFrame(data, columns=['Block', 'Code_Value', 'Meaning', 'RIF_Impact'])

# Save to CSV
df.to_csv('sf50_blocks_reference.csv', index=False)

print("SF-50 Blocks Reference Table created successfully!")
print("\nFirst few rows:")
print(df.head(10))