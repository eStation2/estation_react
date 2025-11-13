"""Minimal FastAPI app for testing container"""
import uvicorn
from fastapi import FastAPI

app = FastAPI(title="eStation Test App")

@app.get("/health")
def health():
    return {"status": "healthy", "message": "Test app running"}

if __name__ == "__main__":
    uvicorn.run("minimal_app:app", host="0.0.0.0", port=8000, reload=True)