"""
Seed dialogues for the few-shot hub.

Strong per-domain examples so experience generation and simulation see good patterns.
Written to the hub when a domain has fewer than 5 examples.
"""

from typing import List, Dict, Any

# Format: same as stored dialogues (goal, domain, context, turns with role/text)
# Used by load_few_shot_examples and experience generator (goal, context, first_utterance from turns[0])
SEED_DIALOGUES: List[Dict[str, Any]] = [
    # ---- Hotel ----
    {
        "goal": "Book a hotel room for tonight in the city centre",
        "domain": "hotel",
        "context": "Traveling for business, need one night, prefer central location.",
        "user_persona": "Business traveler",
        "turns": [
            {"role": "User", "text": "Hi, I need to book a hotel room for tonight. Something in the city centre please."},
            {"role": "SupportBot", "text": "I can help with that. We have several mid-range options in the centre with good availability tonight. Do you have a preference for star rating or budget?"},
            {"role": "User", "text": "Something mid-range is fine. Do any have parking?"},
            {"role": "SupportBot", "text": "Yes, a couple of our central hotels offer on-site parking. I can check availability for tonight if you'd like."},
            {"role": "User", "text": "Yes please, that would be great."},
            {"role": "SupportBot", "text": "I've found availability. One has parking and is in your budget. Shall I hold the room for you?"},
            {"role": "User", "text": "Perfect, yes please. Thank you!"},
        ],
    },
    {
        "goal": "Find a budget hotel for the weekend with free wifi",
        "domain": "hotel",
        "context": "Weekend trip, two guests, need wifi for work.",
        "user_persona": "Budget-conscious traveler",
        "turns": [
            {"role": "User", "text": "I'm looking for a budget hotel for the weekend. Free wifi is important."},
            {"role": "SupportBot", "text": "We have a few budget options with free wifi. How many guests, and any area preference?"},
            {"role": "User", "text": "Two of us, and we'd like to be near the station if possible."},
            {"role": "SupportBot", "text": "There's a well-rated budget option near the station with free wifi. I can check weekend availability."},
            {"role": "User", "text": "That sounds good. Can you confirm the rate?"},
            {"role": "SupportBot", "text": "Rates for that weekend are in the budget range. I can reserve it for you now."},
            {"role": "User", "text": "Yes please, that works. Thanks!"},
        ],
    },
    {
        "goal": "Reserve a hotel room for 2 nights with a swimming pool",
        "domain": "hotel",
        "context": "Family short break, want a pool.",
        "user_persona": "Family traveler",
        "turns": [
            {"role": "User", "text": "I'd like to reserve a room for two nights. Do you have anything with a swimming pool?"},
            {"role": "SupportBot", "text": "Yes, we have hotels with pools. What area do you prefer, and how many guests?"},
            {"role": "User", "text": "North side if possible, two adults and two kids."},
            {"role": "SupportBot", "text": "There's a family-friendly option on the north side with a pool. I can check availability for your dates."},
            {"role": "User", "text": "Please do. We're looking at next weekend."},
            {"role": "SupportBot", "text": "They have availability next weekend. I can hold the room—shall I confirm the reservation?"},
            {"role": "User", "text": "Yes, that's perfect. Thank you!"},
        ],
    },
    {
        "goal": "Book accommodation near the city center for one night",
        "domain": "hotel",
        "context": "Late arrival, need one night close to centre.",
        "user_persona": "Solo traveler",
        "turns": [
            {"role": "User", "text": "I need a room for one night, as close to the city center as possible. I'll be arriving quite late."},
            {"role": "SupportBot", "text": "We have central options with late check-in. Do you have a budget in mind?"},
            {"role": "User", "text": "Moderate is fine. Is 24-hour reception available?"},
            {"role": "SupportBot", "text": "Yes, several of our central hotels have 24-hour reception so late arrival is no problem. I can reserve one for you."},
            {"role": "User", "text": "Great, please go ahead. Thanks!"},
        ],
    },
    {
        "goal": "Find a 4-star hotel with parking for a business stay",
        "domain": "hotel",
        "context": "Business trip, need parking and good wifi.",
        "user_persona": "Business traveler",
        "turns": [
            {"role": "User", "text": "I'm looking for a 4-star hotel with parking for a business trip."},
            {"role": "SupportBot", "text": "We have 4-star options with parking. Which area and how many nights?"},
            {"role": "User", "text": "Near the business district, three nights."},
            {"role": "SupportBot", "text": "There's a 4-star hotel in the business district with parking and good reviews. I can check your dates."},
            {"role": "User", "text": "Please do. I need good wifi too."},
            {"role": "SupportBot", "text": "That one has business-grade wifi. Availability for three nights looks good. Shall I confirm the booking?"},
            {"role": "User", "text": "Yes please. That's exactly what I needed. Thank you!"},
        ],
    },
    # ---- Restaurant ----
    {
        "goal": "Book a table for dinner tonight at an Italian restaurant",
        "domain": "restaurant",
        "context": "Anniversary dinner, two people, prefer Italian.",
        "user_persona": "Couple",
        "turns": [
            {"role": "User", "text": "Hi, I'd like to book a table for dinner tonight. We're looking for Italian."},
            {"role": "SupportBot", "text": "We have several Italian restaurants. For how many people and what time?"},
            {"role": "User", "text": "Two people, around 7:30?"},
            {"role": "SupportBot", "text": "I can check availability for two at 7:30. Any area or price preference?"},
            {"role": "User", "text": "City centre, moderate price is fine."},
            {"role": "SupportBot", "text": "There's availability at a well-rated Italian in the centre. I can hold the table for you."},
            {"role": "User", "text": "Perfect, yes please. Thank you!"},
        ],
    },
    {
        "goal": "Find a restaurant with vegetarian options near the hotel",
        "domain": "restaurant",
        "context": "Staying at central hotel, need veggie options.",
        "user_persona": "Vegetarian traveler",
        "turns": [
            {"role": "User", "text": "Can you recommend a restaurant with good vegetarian options near the hotel?"},
            {"role": "SupportBot", "text": "We have a few nearby with strong vegetarian menus. Do you want to book a table or just get recommendations?"},
            {"role": "User", "text": "Recommendations first. Maybe one that does lunch?"},
            {"role": "SupportBot", "text": "There's one five minutes away that does lunch and has a dedicated veggie selection. I can give you opening times and how to book if you like."},
            {"role": "User", "text": "Yes, that would be great. Thanks!"},
        ],
    },
    # ---- Taxi ----
    {
        "goal": "Book a taxi to the airport for tomorrow morning",
        "domain": "taxi",
        "context": "Early flight, need reliable pickup.",
        "user_persona": "Traveler",
        "turns": [
            {"role": "User", "text": "I need to book a taxi to the airport for tomorrow morning. My flight is early."},
            {"role": "SupportBot", "text": "I can arrange that. What time do you need pickup and what's the pickup address?"},
            {"role": "User", "text": "Pickup at 5:30 AM from the Grand Hotel in the city centre."},
            {"role": "SupportBot", "text": "I've noted 5:30 AM from the Grand Hotel. We'll confirm the booking and send you the driver details. Anything else?"},
            {"role": "User", "text": "No, that's all. Thank you!"},
        ],
    },
    # ---- Train ----
    {
        "goal": "Book a train ticket to London for next Friday",
        "domain": "train",
        "context": "Day trip, one passenger.",
        "user_persona": "Solo traveler",
        "turns": [
            {"role": "User", "text": "I'd like to book a train ticket to London for next Friday."},
            {"role": "SupportBot", "text": "I can help with that. Single or return? Any preferred time?"},
            {"role": "User", "text": "Return, and I'd prefer morning out and evening back."},
            {"role": "SupportBot", "text": "There are morning departures and evening returns. I can show you options and fares."},
            {"role": "User", "text": "Yes please. What's the cheapest option?"},
            {"role": "SupportBot", "text": "The off-peak return is the best value. I can reserve it for you now."},
            {"role": "User", "text": "Perfect, go ahead. Thanks!"},
        ],
    },
    # ---- Attraction ----
    {
        "goal": "Find tourist attractions and book tickets for the museum",
        "domain": "attraction",
        "context": "Weekend visit, interested in the main museum.",
        "user_persona": "Tourist",
        "turns": [
            {"role": "User", "text": "I'm visiting this weekend and would like to see the main museum. Can I book tickets?"},
            {"role": "SupportBot", "text": "Yes. The main museum has weekend availability. How many tickets and which day?"},
            {"role": "User", "text": "Two tickets for Saturday please."},
            {"role": "SupportBot", "text": "Saturday is available. I can complete the booking—any time preference?"},
            {"role": "User", "text": "Morning if possible."},
            {"role": "SupportBot", "text": "Morning slots are open. I'll confirm two tickets for Saturday morning."},
            {"role": "User", "text": "Great, thank you!"},
        ],
    },
]


def get_seed_dialogues_by_domain(domain: str) -> List[Dict[str, Any]]:
    """Return seed dialogues for a given domain."""
    return [d for d in SEED_DIALOGUES if d.get("domain") == domain]
