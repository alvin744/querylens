from collections import defaultdict

from fastapi import APIRouter
from pydantic import BaseModel
from app.database import SessionLocal
from app.models import Evaluation, Ad, Case
from app.services.llm_service import evaluate_ad

router = APIRouter(prefix="/evaluation", tags=["evaluation"])


class EvaluationCreate(BaseModel):
    ad_id: int
    human_label: str
    notes: str | None = None
    ai_score: float | None = None
    ai_label: str | None = None


class AIEvaluationRequest(BaseModel):
    query: str
    ad_title: str
    ad_description: str
    locale: str | None = "SG"


@router.get("/")
def evaluation_home():
    return {"message": "Evaluation route working"}


@router.post("/")
def create_evaluation(payload: EvaluationCreate):
    db = SessionLocal()

    evaluation = Evaluation(
        ad_id=payload.ad_id,
        ai_score=payload.ai_score,
        ai_label=payload.ai_label,
        human_label=payload.human_label,
        notes=payload.notes
    )

    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    db.close()

    return {
        "message": "Evaluation saved",
        "id": evaluation.id
    }


@router.post("/ai")
def run_ai_evaluation(payload: AIEvaluationRequest):
    result = evaluate_ad(
        query=payload.query,
        ad_title=payload.ad_title,
        ad_description=payload.ad_description,
        locale=payload.locale or "SG"
    )
    return result


@router.get("/all")
def get_all_evaluations():
    db = SessionLocal()
    evaluations = db.query(Evaluation).all()

    result = []
    for e in evaluations:
        result.append({
            "id": e.id,
            "ad_id": e.ad_id,
            "ai_score": e.ai_score,
            "ai_label": e.ai_label,
            "human_label": e.human_label,
            "notes": e.notes,
            "disagreement": (
                e.ai_label is not None
                and e.human_label is not None
                and e.ai_label != e.human_label
            )
        })

    db.close()
    return result


@router.get("/metrics")
def get_metrics():
    db = SessionLocal()

    evaluations = db.query(Evaluation).all()

    total = len(evaluations)
    if total == 0:
        db.close()
        return {
            "total_reviews": 0,
            "agreement_rate": 0,
            "disagreement_rate": 0,
            "highly_relevant_count": 0,
            "partially_relevant_count": 0,
            "irrelevant_count": 0,
            "label_distribution": [
                {"name": "Highly Relevant", "value": 0},
                {"name": "Partially Relevant", "value": 0},
                {"name": "Irrelevant", "value": 0},
            ],
            "query_disagreement_stats": [],
        }

    agreement = 0
    highly_relevant = 0
    partially_relevant = 0
    irrelevant = 0

    for e in evaluations:
        if e.ai_label and e.human_label and e.ai_label == e.human_label:
            agreement += 1

        if e.human_label == "Highly Relevant":
            highly_relevant += 1
        elif e.human_label == "Partially Relevant":
            partially_relevant += 1
        elif e.human_label == "Irrelevant":
            irrelevant += 1

    ad_ids = [e.ad_id for e in evaluations]
    ads = db.query(Ad).filter(Ad.id.in_(ad_ids)).all() if ad_ids else []
    case_ids = list({ad.case_id for ad in ads})
    cases = db.query(Case).filter(Case.id.in_(case_ids)).all() if case_ids else []

    ad_map = {ad.id: ad for ad in ads}
    case_map = {case.id: case for case in cases}

    query_stats_map = defaultdict(lambda: {"total_reviews": 0, "disagreements": 0})

    for e in evaluations:
        ad = ad_map.get(e.ad_id)
        if not ad:
            continue

        case = case_map.get(ad.case_id)
        if not case:
            continue

        query = case.query
        query_stats_map[query]["total_reviews"] += 1

        if e.ai_label and e.human_label and e.ai_label != e.human_label:
            query_stats_map[query]["disagreements"] += 1

    query_disagreement_stats = []
    for query, stats in query_stats_map.items():
        total_reviews = stats["total_reviews"]
        disagreements = stats["disagreements"]
        disagreement_rate = round(disagreements / total_reviews, 2) if total_reviews > 0 else 0

        query_disagreement_stats.append({
            "query": query,
            "total_reviews": total_reviews,
            "disagreements": disagreements,
            "disagreement_rate": disagreement_rate,
        })

    query_disagreement_stats.sort(key=lambda x: x["disagreement_rate"], reverse=True)

    db.close()

    return {
        "total_reviews": total,
        "agreement_rate": round(agreement / total, 2),
        "disagreement_rate": round((total - agreement) / total, 2),
        "highly_relevant_count": highly_relevant,
        "partially_relevant_count": partially_relevant,
        "irrelevant_count": irrelevant,
        "label_distribution": [
            {"name": "Highly Relevant", "value": highly_relevant},
            {"name": "Partially Relevant", "value": partially_relevant},
            {"name": "Irrelevant", "value": irrelevant},
        ],
        "query_disagreement_stats": query_disagreement_stats,
    }