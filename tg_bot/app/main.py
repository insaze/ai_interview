import telebot

from ml_model_service import MLModelService
from parse_hh import parse_vacancy
from settings import TG_TOKEN
from utils import escape_md


bot = telebot.TeleBot(TG_TOKEN)


@bot.message_handler(commands=["start"])
def start(message):
    bot.send_message(message.chat.id, 'Привет! Кидай мне ссылку на вакансию, а я скину пример интервью')


@bot.message_handler(content_types=["text"])
def handle_text(message):
    try:
        url = message.text
        vacancy = parse_vacancy(url)
        questions = MLModelService.generate_questions(
            title=vacancy.title,
            description=vacancy.description,
            skills=vacancy.skills,
        )

        title = escape_md(vacancy.title)
        company = escape_md(vacancy.company)
        skills = escape_md(' '.join(f'#{skill}' for skill in vacancy.skills))
        experience = escape_md(vacancy.experience)

        response = f'*{title} @ {company}*\n\n'
        if skills:
            response += f'*Навыки:* {skills}\n'
        response += f'*Опыт:* {experience}\n\n'
        response += '*Вопросы*\n\n'
        response += '\n\n'.join(f'{i}\. {escape_md(question)}' for i, question in enumerate(questions, 1))
        response += '\n\nКидай ссылку на вакансию, а я скину пример интервью'

        bot.send_message(message.chat.id, response, parse_mode='MarkdownV2')
    except Exception as err:
        bot.send_message(message.chat.id, f'Произошла ошибка\n\n`{err!r}`', parse_mode='MarkdownV2')


if __name__ == '__main__':
    bot.infinity_polling()
