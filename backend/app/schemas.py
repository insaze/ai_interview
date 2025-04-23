from pydantic import BaseModel


class InterviewCreate(BaseModel):
    vacancy_link: str


class Interview(BaseModel):
    id: int
    vacancy_link: str
    title: str
    experience: str
    company: str
    description: str
    skills: str

    tasks: list['Task'] = []

    class Config:
        from_attributes = True


class InterviewShort(BaseModel):
    id: int
    title: str
    experience: str
    company: str

    class Config:
        from_attributes = True


class Task(BaseModel):
    id: int
    question: str
    answer: str | None = None
    score: float | None = None
    explanation: str | None = None

    class Config:
        from_attributes = True


class TaskValidate(BaseModel):
    answer: str
