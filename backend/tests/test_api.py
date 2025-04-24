from unittest import TestCase

from app.main import app
from fastapi.testclient import TestClient


class TestAPISmoke(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_get_interviews(self):
        response = self.client.get('/interviews')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))

    def test_get_interview(self):
        response = self.client.get('/interviews/0')
        self.assertEqual(response.status_code, 404)

    def test_delete_interview(self):
        response = self.client.delete('/interviews/0')
        self.assertEqual(response.status_code, 404)

    def test_get_task(self):
        response = self.client.get('/tasks/0')
        self.assertEqual(response.status_code, 404)
