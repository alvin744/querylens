from fastapi import APIRouter
from app.database import SessionLocal
from app.models import Case, Ad

router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("/")
def get_cases():
    db = SessionLocal()

    existing_cases = db.query(Case).all()

    if not existing_cases:
        sample_cases = [
            {
                "query": "best laptop singapore",
                "locale": "SG",
                "ads": [
                    {"title": "Gaming Laptop RTX 4090", "description": "High performance gaming laptop"},
                    {"title": "Student Laptop Under $900", "description": "Affordable student laptops"},
                    {"title": "Laptop Accessories", "description": "Buy sleeves and laptop bags"},
                ],
            },
            {
                "query": "cheap flight to bangkok",
                "locale": "SG",
                "ads": [
                    {"title": "Bangkok Flight Deals", "description": "Book cheap flights from Singapore to Bangkok"},
                    {"title": "Luxury Airport Lounge", "description": "Relax before your flight with premium access"},
                    {"title": "Travel Insurance Promo", "description": "Protect your trip with affordable insurance"},
                ],
            },
            {
                "query": "nearby facial treatment",
                "locale": "SG",
                "ads": [
                    {"title": "Facial Spa Promotion", "description": "Book facial treatment near Tanjong Pagar"},
                    {"title": "Skincare Tips Blog", "description": "Read expert skincare advice online"},
                    {"title": "Hair Transplant Clinic", "description": "Advanced hair restoration services"},
                ],
            },
            {
                "query": "buy office chair",
                "locale": "SG",
                "ads": [
                    {"title": "Ergonomic Office Chairs", "description": "Shop ergonomic chairs with fast delivery"},
                    {"title": "Standing Desk Sale", "description": "Height adjustable desks for home office"},
                    {"title": "Office Chair Wheels", "description": "Replacement caster wheels for chairs"},
                ],
            },
            {
                "query": "iphone repair orchard",
                "locale": "SG",
                "ads": [
                    {"title": "iPhone Repair Orchard", "description": "Same day iPhone repair near Orchard Road"},
                    {"title": "Buy New iPhone 16", "description": "Latest iPhone models available now"},
                    {"title": "Phone Case Clearance", "description": "Discounted phone cases and accessories"},
                ],
            },
        ]

        for case_data in sample_cases:
            sample_case = Case(query=case_data["query"], locale=case_data["locale"])
            db.add(sample_case)
            db.commit()
            db.refresh(sample_case)

            for ad_data in case_data["ads"]:
                ad = Ad(
                    case_id=sample_case.id,
                    title=ad_data["title"],
                    description=ad_data["description"],
                )
                db.add(ad)

            db.commit()

    cases = db.query(Case).all()

    result = []
    for c in cases:
        result.append({
            "id": c.id,
            "query": c.query,
            "locale": c.locale,
            "ads": [
                {
                    "id": a.id,
                    "title": a.title,
                    "description": a.description,
                }
                for a in c.ads
            ]
        })

    db.close()
    return result