
// import { Space } from "./get-spaces";
// import { fetchToken } from "@/lib/coffeeshopToken"


// export interface SpaceId {
//     [key: string]: string;
// }

// // export async function getSpaceIds(): Promise<SpaceId> {
//     try {
//         const token = await fetchToken();
//         if (!token) {
//             console.log('Token not found');
//             return {};
//         }

//         const res = await fetch(`${process.env.API_URI}/coffeeshop/spaces`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             cache: 'no-store'
//         });

//         const spaces = await res.json() as unknown as Space[];
//         const data: SpaceId = {}

//         for (const space of spaces) {
//             const key = Object.keys(space).find(k => space[k as keyof Space] === true) as keyof Space;
//             if (key) {
//                 data[key] = space._id;
//             }
//         };

//         return data;
//     } catch (error: any) {
//         console.log('Error al obtener los id de espacios');
//         console.error(error);
//         return {};
//     }
// }

