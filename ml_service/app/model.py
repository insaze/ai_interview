import json
import re

from gigachat import GigaChat

from .settings import GIGACHAT_API_KEY


class Model:
    giga = GigaChat(
        credentials=GIGACHAT_API_KEY,
        verify_ssl_certs=False,
        model='GigaChat-Pro',
    )

    @classmethod
    def get_questions_prompt(
        cls,
        title: str,
        description: str,
        skills: str,
        number_of_questions: int = 5,
    ) -> str:
        return (
            'Ты интервьюер, специализирующийся на технических интервью для позиции "{title}". '
            'Позиция требует следующего: """{description}""". '
            'Ключевыми навыками для этой роли являются {skills}. '
            'Сгенерируй {number_of_questions} сложных технических вопросов для кандидата, '
            'которые проверят его на соответствие требованиям вакансии и ключевым навыкам. '
            'Ответь в виде JSON-списка с вопросами вида: ["Вопрос 1", "Вопрос 2", ...]'
        ).format(
            title=title,
            description=description,
            skills=skills,
            number_of_questions=number_of_questions,
        )

    @classmethod
    def generate_questions(
        cls,
        title: str,
        description: str,
        skills: str,
        number_of_questions: int = 5,
    ) -> list[str]:
        prompt = cls.get_questions_prompt(
            title=title,
            description=description,
            skills=skills,
            number_of_questions=number_of_questions,
        )
        response = cls.giga.chat(prompt)
        answer = response.choices[0].message.content
        answer = answer.lstrip("```json").rstrip("```")
        return json.loads(answer)

    @classmethod
    def get_validate_answer_prompt(
        cls,
        question: str,
        answer: str,
    ) -> str:
        return (
            'Ты задал кандидату вопрос "{question}", а он ответил на него "{answer}". '
            'Оцени ответ с точки зрения правдоподобности и экспертности. '
            'Ответь в виде JSON {{"score": score, "explanation": "Пояснение"}}, где score – это float от 0 до 1'
        ).format(
            question=question,
            answer=answer,
        )

    RE_FLOAT = re.compile(r'\d+\.\d+')

    @classmethod
    def validate_answer(
        cls,
        question: str,
        answer: str,
    ) -> tuple[float | int, str]:
        prompt = cls.get_validate_answer_prompt(
            question=question,
            answer=answer,
        )
        response = cls.giga.chat(prompt)
        answer = response.choices[0].message.content
        answer = answer.lstrip("```json").rstrip("```")
        data = json.loads(answer)
        return data['score'], data['explanation']
