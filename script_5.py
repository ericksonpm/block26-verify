# Create comprehensive information about military retiree RIF restrictions

print("MILITARY RETIREE RIF RESTRICTIONS")
print("="*50)

print("\nDUAL COMPENSATION ACT OF 1964 IMPACT:")
print("-" * 40)

print("\nFor military retirees to be eligible for veterans preference in RIF, they must meet ONE of these conditions:")
print("1. Combat-related retirement: Military retirement is directly based on a combat-incurred disability")
print("2. Less than 20 years: Military retirement is based on less than 20 years of active duty")
print("3. Continuous service: Employee has been working for the government since November 30, 1964, without a break of more than 30 days")

print("\nMILITARY RETIREE CATEGORIES AND RIF ELIGIBILITY:")
print("-" * 50)

categories = {
    "20+ Year Regular Retiree (No Combat Disability)": {
        "Block 23": "Typically 1 (None)",
        "Block 26": "No/Blank",
        "RIF Status": "Subgroup B - No veterans preference",
        "Notes": "Does NOT qualify for veterans preference in RIF due to Dual Compensation Act"
    },
    "20+ Year Retiree with 30%+ Combat-Related Disability": {
        "Block 23": "6 (10-point compensable/30%+)",
        "Block 26": "Yes/Checked",
        "RIF Status": "Subgroup AD - Highest protection",
        "Notes": "DOES qualify for veterans preference if disability is combat-related"
    },
    "Medical Retiree (Less than 20 years with 30%+ disability)": {
        "Block 23": "6 (10-point compensable/30%+)",
        "Block 26": "Yes/Checked", 
        "RIF Status": "Subgroup AD - Highest protection",
        "Notes": "DOES qualify for veterans preference"
    },
    "Medical Retiree (Less than 20 years, less than 30% disability)": {
        "Block 23": "2-5 (5 or 10-point preference)",
        "Block 26": "Yes/Checked",
        "RIF Status": "Subgroup A - Moderate protection",
        "Notes": "DOES qualify for veterans preference"
    },
    "Reserve/Guard Retiree (Age 60+ with retired pay)": {
        "Block 23": "6 if 30%+ disabled, otherwise varies",
        "Block 26": "Only if disabled veteran",
        "RIF Status": "Depends on disability status",
        "Notes": "Subject to same rules as regular retirees"
    }
}

for category, details in categories.items():
    print(f"\n{category}:")
    for key, value in details.items():
        print(f"  {key}: {value}")

print("\nKEY TAKEAWAYS FOR MILITARY RETIREES:")
print("-" * 40)
takeaways = [
    "Regular 20+ year military retirees typically DO NOT get veterans preference in RIF",
    "Combat-related medical retirees DO get veterans preference regardless of years served",
    "Medical retirees with less than 20 years DO get veterans preference",
    "The key is whether the retirement was combat-related or based on less than 20 years",
    "Block 26 (Veterans Preference for RIF) is the critical indicator",
    "HR errors in coding these blocks are common and should be corrected immediately"
]

for i, takeaway in enumerate(takeaways, 1):
    print(f"{i}. {takeaway}")

# Create military retiree CSV
military_csv_content = '''Category,Block_23_Typical,Block_26_Typical,RIF_Status,Veterans_Preference_Eligible,Notes
20+ Year Regular Retiree (No Combat Disability),1 (None),No/Blank,Subgroup B,No,Dual Compensation Act restrictions apply
20+ Year Retiree with 30%+ Combat-Related Disability,6 (10-point 30%+),Yes/Checked,Subgroup AD,Yes,Combat-related exception applies
Medical Retiree (Less than 20 years with 30%+ disability),6 (10-point 30%+),Yes/Checked,Subgroup AD,Yes,Less than 20 years exception applies
Medical Retiree (Less than 20 years less than 30% disability),2-5 (5 or 10-point),Yes/Checked,Subgroup A,Yes,Less than 20 years exception applies
Reserve/Guard Retiree (Age 60+ with retired pay),Varies by disability,Varies by disability,Depends on disability,Depends on disability,Subject to same rules as regular retirees'''

with open('military_retiree_rif_guide.csv', 'w') as f:
    f.write(military_csv_content)

print("\nCSV file 'military_retiree_rif_guide.csv' created successfully!")