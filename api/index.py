from fastapi import FastAPI, Form, HTTPException
import fastapi.middleware.cors
import google.generativeai as genai
import os
 
app = FastAPI()

# CORS Settings: Yeh tumhare frontend ko is API se baat karne ki permission deta hai
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API Config (Vercel ke environment variables se key uthayega jo tumne save ki thi)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# 1. Health Check Endpoint (Check karne ke liye ki backend zinda hai ya nahi)
@app.get("/api/health")
def health_check():
    return {"status": "Intelli-Credit Backend is LIVE and kicking! 🚀"}

# 2. Intelli-Credit Analysis Endpoint (AI Manager)
@app.post("/api/analyze")
async def analyze_data(site_notes: str = Form(...)):
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API Key missing on server!")

        # Gemini 1.5 Flash model use kar rahe hain (Fastest for hackathons)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Hackathon Specific Prompt for Explainable AI
        prompt = f"""
        Act as an Expert Indian Corporate Credit Manager. 
        Analyze the following Site Visit / Due Diligence notes provided by a credit officer:
        "{site_notes}"
        
        Based on this, generate a quick, professional Credit Appraisal Memo (CAM) summary. 
        Provide the output in simple text with clear bullet points covering:
        - Risk Level (High/Medium/Low)
        - Recommended Action (Approve/Reject)
        - Explainable AI Reason (Why this decision? Keep it strictly professional and grounded in banking logic).
        """
        
        # Gemini se response generate karwana
        response = model.generate_content(prompt)
        
        return {
            "success": True,
            "ai_analysis": response.text
        }
    except Exception as e:
        return {"success": False, "error": str(e)}