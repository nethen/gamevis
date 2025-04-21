"use server";

export const fetchInfo = async (id:string) => {
    const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_API_KEY}`)
    if (!res.ok){
        throw new Error("Failed to fetch details");

    }
    return res.json()
}