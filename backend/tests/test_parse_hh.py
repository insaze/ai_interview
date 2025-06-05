from pathlib import Path
from unittest import TestCase
from unittest.mock import patch

import requests
from app.parse_hh import _validate_response, get_html, parse_vacancy


class TestParseHH(TestCase):
    def test_parse_vacancy(self):
        vacancy_html = (Path(__file__).parent / 'mocks' / 'vacancy.html').read_text()
        with patch('app.parse_hh.get_html', return_value=vacancy_html):
            url = 'https://spb.hh.ru/vacancy/121078743'
            vacancy_info = parse_vacancy(url)
            self.assertEqual(vacancy_info.title, 'Python-разработчик')
            self.assertEqual(vacancy_info.experience, '3–6 лет')
            self.assertGreater(len(vacancy_info.description), 100)
            self.assertEqual(vacancy_info.company, 'ООО Карвиль')

    def test_validate_response(self):
        class Mock:
            def __init__(self, ok: bool, text: str):
                self.ok = ok
                self.text = text

        ok_response = Mock(True, 'OK')
        try:
            _validate_response(ok_response)
        except:
            self.fail()

        err_response = Mock(False, 'Error')
        with self.assertRaises(requests.exceptions.RequestException):
            _validate_response(err_response)

    def test_get_html(self):
        class MockResponse:
            ok = True
            text = '<html>Success</html>'

        with patch('requests.get', return_value=MockResponse()):
            result = get_html('http://example.com')
            self.assertEqual(result, '<html>Success</html>')
