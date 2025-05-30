# Create reference information for SF-50 blocks

print("SF-50 BLOCKS REFERENCE FOR RIF")
print("="*60)

print("\nBLOCK 23 - VETERANS PREFERENCE FOR APPOINTMENT:")
print("-" * 50)
block23_codes = {
    "1": ("None - No Veterans Preference", "Subgroup B"),
    "2": ("5-point preference (TP)", "Subgroup A"),
    "3": ("10-point/disability (XP)", "Subgroup A"),
    "4": ("10-point/compensable (CP)", "Subgroup A"),
    "5": ("10-point/other (XP)", "Subgroup A"),
    "6": ("10-point compensable/30%+ (CPS)", "Subgroup AD"),
    "7": ("No points/Sole Survivorship Preference", "Subgroup A")
}

for code, (meaning, subgroup) in block23_codes.items():
    print(f"Code {code}: {meaning} -> {subgroup}")

print("\nBLOCK 24 - TENURE:")
print("-" * 30)
block24_codes = {
    "1": ("Career employee (3+ years service)", "Tenure Group I"),
    "2": ("Career-conditional (less than 3 years)", "Tenure Group II"),
    "3": ("Temporary/term/time-limited", "Tenure Group III")
}

for code, (meaning, group) in block24_codes.items():
    print(f"Code {code}: {meaning} -> {group}")

print("\nBLOCK 26 - VETERANS PREFERENCE FOR RIF:")
print("-" * 40)
block26_codes = {
    "Yes/Checked": "Eligible for Veterans Preference in RIF",
    "No/Blank": "Not eligible for Veterans Preference in RIF"
}

for code, meaning in block26_codes.items():
    print(f"{code}: {meaning}")

print("\nRIF PROTECTION HIERARCHY (Strongest to Weakest):")
print("-" * 50)
hierarchy = [
    "Group I-AD (Career + 30%+ disabled veteran)",
    "Group I-A (Career + other veterans preference)",
    "Group I-B (Career + no veterans preference)",
    "Group II-AD (Conditional + 30%+ disabled veteran)",
    "Group II-A (Conditional + other veterans preference)",
    "Group II-B (Conditional + no veterans preference)",
    "Group III-AD (Temporary + 30%+ disabled veteran)",
    "Group III-A (Temporary + other veterans preference)",
    "Group III-B (Temporary + no veterans preference)"
]

for i, level in enumerate(hierarchy, 1):
    print(f"{i}. {level}")

# Create a simple CSV content
csv_content = '''Block,Code_Value,Meaning,RIF_Impact
23,1,None - No Veterans Preference,Subgroup B (lowest protection)
23,2,5-point preference (TP),Subgroup A (moderate protection)
23,3,10-point/disability (XP),Subgroup A (moderate protection)
23,4,10-point/compensable (CP),Subgroup A (moderate protection)
23,5,10-point/other (XP),Subgroup A (moderate protection)
23,6,10-point compensable/30%+ (CPS),Subgroup AD (highest protection)
23,7,No points/Sole Survivorship Preference (SSP),Subgroup A (moderate protection)
24,1,Career employee - completed 3+ years qualifying service,Tenure Group I (highest protection)
24,2,Career-conditional - less than 3 years or on probation,Tenure Group II (moderate protection)
24,3,Temporary term or time-limited appointment,Tenure Group III (lowest protection)
26,Yes/Checked,Eligible for Veterans Preference in RIF,Eligible for veterans subgroup placement
26,No/Blank,Not eligible for Veterans Preference in RIF,Placed in Subgroup B regardless of veteran status'''

# Write to file
with open('sf50_blocks_reference.csv', 'w') as f:
    f.write(csv_content)

print("\nCSV file 'sf50_blocks_reference.csv' created successfully!")