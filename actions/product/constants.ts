'use server'

// Hardcoded values for spaces Ids that could change in the future
export const spaceIds = {
    "buffer": "66f203ced3f26274cc8b5005",
    "cold": "66f203ced3f26274cc8b5007",
    "checkIn": "66f203ced3f26274cc8b4ff3",
    "kitchen": "66f203ced3f26274cc8b500d",
    "checkOut": "66f203cfd3f26274cc8b52bd"
}

export const productsInfo: { sku: string, threshold: number, quantity: number, place: keyof typeof spaceIds }[] = [
    { sku: 'LECHEENTERA', threshold: 15, quantity: 24, place: 'cold'},
    { sku: 'CAFEGRANO', threshold: 20, quantity: 10, place: 'cold'},
    { sku: 'ENDULZANTESACHET', threshold: 60, quantity: 100, place: 'checkOut'},
    { sku: 'AZUCARSACHET', threshold: 60, quantity: 100, place: 'checkOut'},
    { sku: 'VASOCAFE', threshold: 60, quantity: 100, place: 'checkIn'},
    { sku: 'VASOCAFEDOBLE', threshold: 50, quantity: 80, place: 'checkIn'},
    { sku: 'VASOCAFEEXPRESO', threshold: 70, quantity: 120, place: 'checkIn'},
];