from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field


class FlightLeg(BaseModel):
    date: date
    from_airport: str = Field(min_length=3, max_length=3)
    to_airport: str = Field(min_length=3, max_length=3)


class Passengers(BaseModel):
    adults: int = Field(ge=1, le=9)
    children: int = Field(default=0, ge=0, le=9)


class SearchRequest(BaseModel):
    flights: list[FlightLeg]
    seat: str = "economy"
    trip: Literal["one-way", "round-trip"] = "one-way"
    passengers: Passengers
    language: str = "en"


class SearchResponse(BaseModel):
    ok: bool
    data: Any | None = None
    error: str | None = None
