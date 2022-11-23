const SUPABASE_URL = 'https://gxwgjhfyrlwiqakdeamc.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQxMTMxMiwiZXhwIjoxOTUxOTg3MzEyfQ.PHekiwfLxT73qQsLklp0QFEfNx9NlmkssJFDnlvNIcA';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// export async functions that fetch data

// export async function getBeanies(title, astroSign, releaseYear) {
export async function getBeanies(filter, paging) {
    const page = paging.page;
    const pageSize = paging.pageSize;

    let query = client
        .from('beanie_babies')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('title');
    // .limit(100);
    if (filter.title) {
        query = query.ilike('title', `%${filter.title}%`);
    }
    if (filter.astroSign) {
        query = query.eq('astroSign', filter.astroSign);
    }
    if (filter.animalType) {
        query.eq('animal', filter.animalType);
    }

    if (filter.theme) {
        query.eq('theme', filter.theme);
    }
    // export async function getBeanies(title, astroSign, animalType, theme) {
    //     let query = client
    //         .from('beanie_babies')
    //         .select('*', { count: 'exact' })
    //         .order('title')
    //         .limit(100);
    //     if (title) {
    //         query = query.ilike('title', `%${title}%`);
    //     }
    //     if (astroSign) {
    //         query = query.eq('astroSign', astroSign);
    //     }
    //     if (animalType) {
    //         query.eq('animal', animalType);
    //     }

    //     if (theme) {
    //         query.eq('theme', theme);
    //     }
    const response = await query;
    // console.log(response);
    return response;
}

export async function getAstroSigns() {
    let query = client.from('beanie_baby_astro_signs').select('*').order('name');
    const response = await query;
    return response;
}

export async function getAnimalType() {
    let query = client.from('beanie_baby_animals').select('*');
    const response = await query;
    return response;
}
export async function getThemeType() {
    let query = client.from('beanie_baby_themes').select('*');
    const response = await query;
    return response;
}
