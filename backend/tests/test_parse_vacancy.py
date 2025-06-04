from unittest import TestCase

from app.parse_hh import parse_vacancy


class TestParseVacancy(TestCase):
    def test_parse_vacancy(self):
        url = 'https://spb.hh.ru/vacancy/119319270'
        vacancy_info = parse_vacancy(url)
        self.assertEqual(vacancy_info.title, 'Python-разработчик (Middle/ Senior)')
        self.assertEqual(vacancy_info.experience, '3–6 лет')
        self.assertGreater(len(vacancy_info.description), 100)
        self.assertEqual(vacancy_info.company, 'Lenvendo')
