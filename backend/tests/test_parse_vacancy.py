from unittest import TestCase

from app.parse_hh import parse_vacancy


class TestParseVacancy(TestCase):
    def test_parse_vacancy(self):
        url = 'https://spb.hh.ru/vacancy/118824674?from=anonymous_recommended&hhtmFrom=main'
        vacancy_info = parse_vacancy(url)
        self.assertEqual(vacancy_info.title, 'Backend-разработчик (Леста Старт)')
        self.assertEqual(vacancy_info.experience, 'не требуется')
        self.assertGreater(len(vacancy_info.description), 100)
        self.assertEqual(vacancy_info.company, 'Леста Игры')
