from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import backref, relationship

from .database import Base, engine


class Task(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=True)
    score = Column(String, nullable=True)
    explanation = Column(String, nullable=True)
    interview_id = Column(Integer, ForeignKey('interviews.id'))
    interview = relationship('Interview', back_populates='tasks')


class Interview(Base):
    __tablename__ = 'interviews'

    id = Column(Integer, primary_key=True, index=True)
    vacancy_link = Column(String)
    title: str = Column(String)
    experience: str = Column(String)
    company: str = Column(String)
    description: str = Column(String)
    skills: str = Column(String)
    tasks = relationship('Task', back_populates='interview')


Base.metadata.create_all(bind=engine)
