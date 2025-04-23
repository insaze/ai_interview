import requests

from .settings import ML_SERVICE_HOST, ML_SERVICE_PORT


class MLModelService:
    base_url = f'http://{ML_SERVICE_HOST}:{ML_SERVICE_PORT}'

    @classmethod
    def _request(cls, endpoint: str, body: dict):
        response = requests.post(cls.base_url + endpoint, json=body)
        return response.json()

    @classmethod
    def generate_questions(
        cls,
        title: str,
        description: str,
        skills: str,
        number_of_questions: int = 5,
    ) -> list[str]:
        return cls._request(
            endpoint='/generate_questions',
            body=dict(
                title=title,
                description=description,
                skills=skills,
                number_of_questions=number_of_questions,
            )
        )['questions']

    @classmethod
    def validate_answer(
        cls,
        question: str,
        answer: str,
    ) -> tuple[float, str]:
        response = cls._request(
            endpoint='/validate_answer',
            body=dict(
                question=question,
                answer=answer,
            )
        )
        return response['score'], response['explanation']
