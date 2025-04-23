from unittest import TestCase

from app.model import Model


class TestModel(TestCase):
    def test_generate_questions(self):
        questions = Model.generate_questions(
            title='Python разработчик',
            description='Автоматизировать перекладывание JSON',
            skills='Python, JSON',
            number_of_questions=6,
        )
        self.assertTrue(isinstance(questions, list))
        self.assertTrue(all(isinstance(question, str) for question in questions))
        self.assertEqual(len(questions), 6)
