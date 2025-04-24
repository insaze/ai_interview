from sqlalchemy.orm import Session

from . import models
from .ml_model_service import MLModelService
from .parse_hh import parse_vacancy


def create_interview(db: Session, vacancy_link: str) -> models.Interview:
    vacancy_info = parse_vacancy(url=vacancy_link)
    db_interview = models.Interview(
        vacancy_link=vacancy_link,
        title=vacancy_info.title,
        experience=vacancy_info.experience,
        company=vacancy_info.company,
        description=vacancy_info.description,
        skills=vacancy_info.skills,
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)

    questions = MLModelService.generate_questions(
        title=db_interview.title,
        description=db_interview.description,
        skills=db_interview.skills,
    )
    for question in questions:
        create_task(db, interview_id=db_interview.id, question=question)

    return db_interview


def get_interviews(db: Session) -> list[models.Interview]:
    return db.query(models.Interview).all()


def get_interview(db: Session, interview_id: int) -> models.Interview | None:
    return db.query(models.Interview).filter(models.Interview.id == interview_id).first()


def delete_interview(db: Session, interview_id: int) -> models.Interview | None:
    db_interview = get_interview(db, interview_id=interview_id)
    if not db_interview:
        return None

    db.delete(db_interview)
    db.commit()
    return db_interview


def create_task(db: Session, interview_id: int, question: str) -> models.Task:
    db_task = models.Task(
        interview_id=interview_id,
        question=question,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: int) -> models.Task | None:
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def validate_task(db: Session, task_id: int, answer: str) -> models.Task:
    db_task = get_task(db, task_id=task_id)
    score, explanation = MLModelService.validate_answer(
        question=db_task.question,
        answer=answer,
    )
    db_task.answer = answer
    db_task.score = score
    db_task.explanation = explanation
    db.add(db_task)
    db.commit()
    return db_task
