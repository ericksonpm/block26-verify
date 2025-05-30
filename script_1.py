import pandas as pd

# Create a comprehensive reference table for SF-50 Block codes
sf50_data = {
    'Block': ['23', '23', '23', '23', '23', '23', '23', '24', '24', '24', '26', '26'],
    'Code_Value': ['1', '2', '3', '4', '5', '6', '7', '1 or Permanent', '2 or Conditional', '3 or Indefinite', 'Yes/Checked', 'No/Blank'],
    'Meaning': [
        'None - No Veterans Preference',
        '5-point preference (TP)',
        '10-point/disability (XP)',
        '10-point/compensable (CP)',
        '10-point/other (XP)',
        '10-point compensable/30%+ (CPS)',
        'No points/Sole Survivorship Preference (SSP)',
        'Career employee - completed 3+ years qualifying service',
        'Career-conditional - less than 3 years or on probation',
        'Temporary, term, or time-limited appointment',
        'Eligible for Veterans Preference in RIF',
        'Not eligible for Veterans Preference in RIF'
    ],
    'RIF_Impact': [
        'Subgroup B (lowest protection)',
        'Subgroup A (moderate protection)',
        'Subgroup A (moderate protection)',
        'Subgroup A (moderate protection)',
        'Subgroup A (moderate protection)',
        'Subgroup AD (highest protection)',
        'Subgroup A (moderate protection)',
        'Tenure Group I (highest protection)',
        'Tenure Group II (moderate protection)',
        'Tenure Group III (lowest protection)',
        'Eligible for veterans subgroup placement',
        'Placed in Subgroup B regardless of veteran status'
    ]
}

sf50_df = pd.DataFrame(sf50_data)
sf50_df.to_csv('sf50_blocks_reference.csv', index=False)

print("SF-50 Blocks Reference Table:")
print(sf50_df.to_string(index=False))