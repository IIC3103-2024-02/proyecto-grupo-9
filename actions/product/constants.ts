
// Hardcoded values for spaces Ids that could change in the future
const ProdSpaceIds = {
    "buffer": "66f203ced3f26274cc8b5005",
    "cold": "66f203ced3f26274cc8b5007",
    "checkIn": "66f203ced3f26274cc8b4ff3",
    "kitchen": "66f203ced3f26274cc8b500d",
    "checkOut": "66f203cfd3f26274cc8b52bd"
}

const DevSpaceIds = {
    "buffer": "66db17eea263b952c8f5c664",
    "cold": "66db17eea263b952c8f5c681",
    "checkIn": "66db17eea263b952c8f5c653",
    "kitchen": "66db17eea263b952c8f5c66e",
    "checkOut": "66db17eea263b952c8f5c651"
}

export const spaceIds = process.env.API_URI?.startsWith("https://prod") ? ProdSpaceIds : DevSpaceIds;

export const productsInfo: { sku: string, threshold: number, quantity: number, place: keyof typeof spaceIds, distributor: boolean }[] = [
    { sku: 'LECHEENTERA', threshold: 15, quantity: 24, place: 'cold', distributor: true},
    { sku: 'CAFEGRANO', threshold: 20, quantity: 10, place: 'cold', distributor: true},
    { sku: 'KUCHENMANZANANUEZ', threshold: 6, quantity: 2, place: 'cold', distributor: true},   // new
    { sku: 'CHEESECAKE', threshold: 6, quantity: 1, place: 'cold', distributor: false},         // new
    { sku: 'QUESOENTERO', threshold: 4, quantity: 1, place: 'cold', distributor: false},        // new
    { sku: 'JAMONENTERO', threshold: 4, quantity: 1, place: 'cold', distributor: true},         // new
    { sku: 'NUTELLA', threshold: 2, quantity: 1, place: 'cold', distributor: false},         // new

    { sku: 'ENDULZANTESACHET', threshold: 60, quantity: 100, place: 'checkOut', distributor: true},
    { sku: 'AZUCARSACHET', threshold: 60, quantity: 100, place: 'checkOut', distributor: true},
    { sku: 'BROWNIE', threshold: 14, quantity: 4, place: 'checkOut', distributor: true},         // new
    { sku: 'PALMERA', threshold: 15, quantity: 1, place: 'checkOut', distributor: false},       // new

    { sku: 'VASOCAFE', threshold: 60, quantity: 100, place: 'checkIn', distributor: true},
    { sku: 'VASOCAFEDOBLE', threshold: 50, quantity: 80, place: 'checkIn', distributor: true},
    { sku: 'VASOCAFEEXPRESO', threshold: 70, quantity: 120, place: 'checkIn', distributor: true},
    { sku: 'CROISSANT', threshold: 20, quantity: 10, place: 'checkIn', distributor: true},      // new
];

export const ingredientsPreparation = [
    { sku: 'LECHEENTERAPORCION', base: 'LECHEENTERA', quantity: 12, verify: 8 },
    { sku: 'CAFEMOLIDOPORCION', base: 'CAFEGRANO', quantity: 20, verify: 14 },
    { sku: 'KUCHENMANZANANUEZTROZO', base: 'KUCHENMANZANANUEZ', quantity: 5, verify: 3 },
    { sku: 'CHEESECAKEPORCION', base: 'CHEESECAKE', quantity: 5, verify: 3 },
    { sku: 'QUESOLAMINADO', base: 'QUESOENTERO', quantity: 30, verify: 24 },
    { sku: 'JAMONLAMINADO', base: 'JAMONENTERO', quantity: 40, verify: 30 },
    { sku: 'NUTELLAPORCION', base: 'NUTELLA', quantity: 80, verify: 70 },
]

export const nonRecipeProducts = [
    "AZUCARSACHET",
    "ENDULZANTESACHET",
    "KUCHENMANZANANUEZ",
    "BROWNIE",
    "CHEESECAKE",
    "PALMERA",
    "CROISSANT",
    "QUESOENTERO",
    "JAMONENTERO",
    "NUTELLA"
]

export const recipeProducts = [
    "CAFEEXPRESSO",
    "CAFEEXPRESSODOBLE",
    "CAFELATTE",
    "CAFELATTEDOBLE",
    "KUCHENMANZANANUEZTROZO",
    "CHEESECAKEPORCION",
    // "COISSANTJAMONQUESO",
    "CROISSANTJAMONQUESO",
    "COISSANTNUTELLA",
]

// const a = [{
// // "CAFEGRANO": 'si',
//  "CAFEMOLIDOPORCION": 'si',
// // "CAFEEXPRESSO": 'si',
// // "CAFEEXPRESSODOBLE": 'si',
// // "LECHEENTERA": 'si',
//  "LECHEENTERAPORCION": 'si',
// // "CAFELATTE": 'si',
// // "CAFELATTEDOBLE": 'si',
//  "AZUCARSACHET": 'si',
//  "ENDULZANTESACHET": 'si',
//  "VASOCAFE": 'si',
//  "VASOCAFEDOBLE": 'si',
//  "VASOCAFEEXPRESO": 'si',

//  "KUCHENMANZANANUEZ": 'si',
//  "KUCHENMANZANANUEZTROZO": 'si',
//  "BROWNIE": 'si',
//  "CHEESECAKE": '---------no',
//  "CHEESECAKEPORCION": 'si',
//  "PALMERA": '-----------no',
//  "CROISSANT": 'si',
//  "QUESOENTERO": '------no',
//  "QUESOLAMINADO": 'si',
//  "JAMONENTERO": 'si',
//  "JAMONLAMINADO": 'si',
// // "**** CROISSANTJAMONQUESO *****": 'si',

//  "NUTELLA": '-------------no',
//  "NUTELLAPORCION": 'si',
// // "CROISSANTNUTELLA": 'si',
// }]


