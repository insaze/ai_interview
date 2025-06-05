from pathlib import Path
from unittest import TestCase
from unittest.mock import patch

from app.parse_hh import parse_vacancy


class TestParseVacancy(TestCase):
    def test_parse_vacancy(self):
        vacancy_html = (Path(__file__).parent / 'mocks' / 'vacancy.html').read_text()
        with patch('app.parse_hh.get_html', return_value=vacancy_html):
            url = 'https://spb.hh.ru/vacancy/121078743'
            vacancy_info = parse_vacancy(url)
            self.assertEqual(vacancy_info.title, 'Python-разработчик')
            self.assertEqual(vacancy_info.experience, '3–6 лет')
            self.assertGreater(len(vacancy_info.description), 100)
            self.assertEqual(vacancy_info.company, 'ООО Карвиль')
