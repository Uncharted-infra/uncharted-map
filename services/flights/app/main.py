from __future__ import annotations

import json
from dataclasses import asdict, is_dataclass
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.schemas import SearchRequest, SearchResponse

app = FastAPI(title="Uncharted Flights Sidecar", version="0.1.0")


def to_jsonable(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if is_dataclass(value):
        return to_jsonable(asdict(value))
    if isinstance(value, dict):
        return {str(k): to_jsonable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [to_jsonable(v) for v in value]
    if hasattr(value, "__dict__"):
        return to_jsonable(vars(value))
    if hasattr(value, "model_dump"):
        return to_jsonable(value.model_dump())
    if hasattr(value, "dict"):
        return to_jsonable(value.dict())
    try:
        json.dumps(value)
        return value
    except TypeError:
        return str(value)


def build_fast_flights_query(body: SearchRequest):
    try:
        from fast_flights import FlightData, Passengers, create_query, get_flights
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=f"fast-flights not installed: {exc}") from exc

    flight_data = [
        FlightData(
            date=leg.date.isoformat(),
            from_airport=leg.from_airport.upper(),
            to_airport=leg.to_airport.upper(),
        )
        for leg in body.flights
    ]
    passengers = Passengers(
        adults=body.passengers.adults,
        children=body.passengers.children,
    )
    query = create_query(
        flight_data=flight_data,
        trip=body.trip,
        seat=body.seat,
        passengers=passengers,
        language=body.language,
    )
    return get_flights, query


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/search", response_model=SearchResponse)
def search(body: SearchRequest) -> SearchResponse:
    try:
        get_flights, query = build_fast_flights_query(body)
        result = get_flights(query)
        return SearchResponse(ok=True, data=to_jsonable(result))
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — surface provider errors to Node worker
        raise HTTPException(status_code=502, detail=str(exc)) from exc
