from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import cases, evaluation

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QueryLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://querylens-frontend.onrender.com"
    ]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)
app.include_router(evaluation.router)

@app.get("/")
def root():
    return {"message": "QueryLens API running"}