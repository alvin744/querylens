from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    locale = Column(String, nullable=True)

    ads = relationship("Ad", back_populates="case")


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    case = relationship("Case", back_populates="ads")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    ad_id = Column(Integer, nullable=False)
    ai_score = Column(Float, nullable=True)
    ai_label = Column(String, nullable=True)
    human_label = Column(String, nullable=True)
    notes = Column(Text, nullable=True)