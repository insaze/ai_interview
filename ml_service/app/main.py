from fastapi import FastAPI

from . import schemas

from .model import Model


app = FastAPI()


@app.post('/generate_questions')
def generate_questions(body: schemas.GenerateQuestionsBody) -> schemas.GenerateQuestionsResponse:
    return schemas.GenerateQuestionsResponse(
        questions=Model.generate_questions(
            title=body.title,
            description=body.description,
            skills=body.skills,
            number_of_questions=body.number_of_questions,
        )
    )


@app.post('/validate_answer')
def validate_answer(body: schemas.ValidateAnswerBody) -> schemas.ValidateAnswerResponse:
    score, explanation = Model.validate_answer(
        question=body.question,
        answer=body.answer,
    )
    return schemas.ValidateAnswerResponse(score=score, explanation=explanation)
