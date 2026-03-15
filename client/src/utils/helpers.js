export function getPhotoGradient(type) {
    const gradients = {
        ocean: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)',
        mountain: 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #b2bec3 100%)',
        city: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%)',
        tropical: 'linear-gradient(135deg, #1a472a 0%, #2d5a27 50%, #82b74b 100%)',
        desert: 'linear-gradient(135deg, #c44536 0%, #e76f51 50%, #f4a261 100%)',
        lake: 'linear-gradient(135deg, #1e3799 0%, #0652dd 50%, #74b9ff 100%)',
        default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradients[type] || gradients.default;
}

export const sampleHomes = [
    { _id: 'sample-1', name: 'Oceanfront Villa', location: 'Malibu, California', price: 450, rating: 4.9, description: 'Stunning beachfront property with panoramic ocean views, private pool, and direct beach access.', photo: 'ocean', isSample: true },
    { _id: 'sample-2', name: 'Mountain Retreat', location: 'Aspen, Colorado', price: 320, rating: 4.8, description: 'Cozy alpine cabin with breathtaking mountain views, hot tub, and ski-in/ski-out access.', photo: 'mountain', isSample: true },
    { _id: 'sample-3', name: 'Urban Loft', location: 'New York City', price: 275, rating: 4.7, description: 'Modern loft in the heart of Manhattan with exposed brick, city views, and rooftop access.', photo: 'city', isSample: true },
    { _id: 'sample-4', name: 'Tropical Paradise', location: 'Bali, Indonesia', price: 180, rating: 4.9, description: 'Private villa surrounded by rice terraces with infinity pool and traditional Balinese design.', photo: 'tropical', isSample: true },
    { _id: 'sample-5', name: 'Desert Oasis', location: 'Joshua Tree, CA', price: 195, rating: 4.6, description: 'Unique desert home with stunning sunset views, outdoor fire pit, and stargazing deck.', photo: 'desert', isSample: true },
    { _id: 'sample-6', name: 'Lake House', location: 'Lake Tahoe, Nevada', price: 380, rating: 4.8, description: 'Spacious lakefront home with private dock, kayaks, and wraparound deck overlooking the water.', photo: 'lake', isSample: true }
];

export function downloadHouseRules(homeName) {
    const rules = `
HOUSE RULES - ${homeName}
========================

CHECK-IN / CHECK-OUT
• Check-in: 3:00 PM - 10:00 PM
• Check-out: 11:00 AM
• Self check-in with lockbox

DURING YOUR STAY
• No smoking
• No parties or events
• No pets unless approved
• Quiet hours: 10 PM - 8 AM

ADDITIONAL RULES
• Please remove shoes indoors
• Keep the property clean
• Report any damages immediately
• Dispose of trash properly

AMENITIES
• WiFi password provided at check-in
• Parking available on premises
• Kitchen fully equipped

Thank you for choosing V-Stay!
  `;

    const blob = new Blob([rules], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `House_Rules_${homeName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
