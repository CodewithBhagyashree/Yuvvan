import pandas as pd

def detect_financial_anomalies(gst_data, bank_data):
    print("🔍 Cross-leveraging GST Returns against Bank Statements...\n")
    
    # 1. Calculate Total Revenue Declared in GST (GSTR-3B)
    total_gst_revenue = sum(month['declared_sales'] for month in gst_data)
    
    # 2. Calculate Total Inward Remittances in Bank
    total_bank_deposits = sum(month['total_deposits'] for month in bank_data)
    
    print(f"Total GST Declared Revenue: ₹{total_gst_revenue:,}")
    print(f"Total Bank Deposits: ₹{total_bank_deposits:,}")
    
    # 3. The Logic (Indian Banking Context)
    discrepancy = total_bank_deposits - total_gst_revenue
    margin_of_error = 0.10 * total_gst_revenue # 10% tolerance allowed
    
    findings = {
        "status": "CLEAR",
        "red_flags": [],
        "risk_score_penalty": 0
    }
    
    # Anomaly 1: Revenue Inflation / Circular Trading (Fake Invoices)
    if total_gst_revenue > total_bank_deposits + margin_of_error:
        findings["status"] = "HIGH RISK"
        findings["red_flags"].append("WARNING: GST revenue is significantly higher than actual bank deposits. Possible Circular Trading or Fake Invoicing.")
        findings["risk_score_penalty"] += 30
        
    # Anomaly 2: Tax Evasion / Under-reporting
    elif total_bank_deposits > total_gst_revenue + margin_of_error:
        findings["status"] = "MODERATE RISK"
        findings["red_flags"].append("WARNING: Bank deposits exceed declared GST sales. Possible tax evasion or off-book transactions.")
        findings["risk_score_penalty"] += 15
        
    else:
        findings["red_flags"].append("GST and Bank flows are perfectly synchronized.")
        
    return findings

# --- Testing the Prototype ---
if __name__ == "__main__":
    # Dummy GST Data (e.g., from GSTR-3B portal)
    mock_gst_data = [
        {"month": "Jan", "declared_sales": 5000000}, # 50 Lakhs
        {"month": "Feb", "declared_sales": 6000000}, # 60 Lakhs
        {"month": "Mar", "declared_sales": 4500000}  # 45 Lakhs
        # Total GST = 1.55 Crores
    ]
    
    # Dummy Bank Statement Data
    mock_bank_data = [
        {"month": "Jan", "total_deposits": 1000000}, # 10 Lakhs (Money actually received)
        {"month": "Feb", "total_deposits": 1200000}, # 12 Lakhs
        {"month": "Mar", "total_deposits": 800000}   # 8 Lakhs
        # Total Bank = 30 Lakhs
    ]
    
    result = detect_financial_anomalies(mock_gst_data, mock_bank_data)
    
    print("\n--- AI Engine Verdict ---")
    print(f"Status: {result['status']}")
    for flag in result['red_flags']:
        print(f"-> {flag}")
    print(f"Risk Penalty Applied: {result['risk_score_penalty']} points")