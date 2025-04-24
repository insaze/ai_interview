from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from . import crud, schemas
from .database import get_db


app = FastAPI()


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
