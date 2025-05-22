from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import PlainTextResponse
import time

from . import crud, schemas
from .database import get_db

from prometheus_client import start_http_server, Counter, Histogram, generate_latest, REGISTRY
start_http_server(9001)

REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"]
)

REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency by status code",
    ["method", "endpoint", "status_code"]
)

ERROR_COUNT = Counter(
    "http_errors_total",
    "Total HTTP errors",
    ["method", "endpoint", "status_code", "error_type"]
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method
        endpoint = request.url.path
        start_time = time.time()
        
        try:
            response = await call_next(request)
        except Exception as e:
            status_code = 500
            ERROR_COUNT.labels(
                method=method,
                endpoint=endpoint,
                status_code=str(status_code),
                error_type="5xx"
            ).inc()
            raise e from None
        else:
            status_code = response.status_code
            if status_code >= 400:
                ERROR_COUNT.labels(
                    method=method,
                    endpoint=endpoint,
                    status_code=str(status_code),
                    error_type=f"{status_code//100}xx"
                ).inc()
        
        latency = time.time() - start_time
        REQUEST_LATENCY.labels(
            method=method,
            endpoint=endpoint,
            status_code=str(status_code)
        ).observe(latency)
        
        REQUEST_COUNT.labels(
            method=method,
            endpoint=endpoint,
            status_code=str(status_code)
        ).inc()
        
        return response

app.add_middleware(MetricsMiddleware)

@app.get('/ping')
def ping():
    return "pong"

@app.post('/interviews', response_model=schemas.Interview)
def create_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    db_interview = crud.create_interview(db, vacancy_link=interview.vacancy_link)
    return db_interview


@app.get('/interviews', response_model=list[schemas.InterviewShort])
def get_interviews(db: Session = Depends(get_db)):
    return crud.get_interviews(db)


@app.get('/interviews/{interview_id}', response_model=schemas.Interview)
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    db_interview = crud.get_interview(db, interview_id=interview_id)
    if db_interview is None:
        raise HTTPException(status_code=404)
    return db_interview


@app.delete('/interviews/{interview_id}')
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    db_interview = crud.delete_interview(db, interview_id=interview_id)
    if db_interview is None:
        raise HTTPException(status_code=404)
    return Response(status_code=200)


@app.get('/tasks/{task_id}', response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if not db_task:
        raise HTTPException(status_code=404)
    return db_task


@app.post('/tasks/{task_id}/validate', response_model=schemas.Task)
def validate_task(task_id: int, task_validate: schemas.TaskValidate, db: Session = Depends(get_db)):
    db_task = crud.validate_task(db, task_id=task_id, answer=task_validate.answer)
    return db_task
