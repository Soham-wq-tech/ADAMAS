from fastapi import FastAPI

app = FastAPI(
    title="THE REAL ROOM API"
)


@app.get("/")
def home():
    return {
        "message": "THE REAL ROOM backend is running"
    }