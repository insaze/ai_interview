from typing import Any

from pydantic import BaseModel


class GenerateQuestionsBody(BaseModel):
    title: str
    description: str
    skills: str
    number_of_questions: int = 5


class GenerateQuestionsResponse(BaseModel):
    questions: list[str]


class ValidateAnswerBody(BaseModel):
    question: str
    answer: str


class ValidateAnswerResponse(BaseModel):
    score: int | float
    explanation: str
