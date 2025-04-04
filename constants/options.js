export const SelectTravelersList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'Traveling solo',
      icon: '👤', // or your icon component
      people:' 1 person'
    },
    {
      id: 2,
      title: 'Couple',
      desc: 'Romantic getaway for two',
      icon: '👫', // or your icon component
      people: '2 people'
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun loving adventurers',
      icon: '👨‍👩‍👧‍👦', // or your icon component
      people: '4 to 5 people'// typical family size
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A bunch of thrill-seekers',
      icon: '👬', // or your icon component
      people:'5 to 10 people '// typical friend group size
    }
  ];



  export const SelectBudgetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay conscious of costs',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep cost on the average side',
      icon: '💵'
    },
    {
      id: 3,
      title: 'Luxury',
      desc: "Don't worry about cost",
      icon: '💎'
    }
  ];


// constants/options.js
export const AI_PROMPT = `Generate a comprehensive travel plan for Location: {location}, covering {totalDays} day and {totalNights} night for {traveler} with {budget} budget.

Requirements:
- Flight information: Include airline, price, booking URL, departure/arrival times
- Hotels (3+ options): Name, address, price/night, REAL image URL, coordinates, rating, description
- Attractions: Name, details, REAL image URL, coordinates, ticket price, best visit time
- Itinerary: Detailed day-by-day schedule with optimal times
- All data must be current and verifiable
- Use ONLY real image URLs (no placeholders)
- Format response as valid JSON with this structure:
{
  "travelPlan": {
    "location": string,
    "duration": string,
    "travelerType": string,
    "budget": string,
    "flights": Flight[],
    "hotels": Hotel[],
    "attractions": Attraction[],
    "itinerary": DayPlan[]
  }
}

Special Instructions:
1. For images: Use official URLs or Unsplash (https://source.unsplash.com/400x300/?[query])
2. For flights: Use real booking URLs (expedia.com, kayak.com, etc.)
3. All prices must be in local currency
4. Coordinates must be in {lat, lng} format`;

export const DEFAULT_VALUES = {
  location: 'Unknown Location',
  days: 1,
  nights: 0,
  traveler: 'Solo Traveler',
  budget: 'Moderate'
};