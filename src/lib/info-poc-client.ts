import {informationPocClient} from '@/lib/client';


export const getInfoPocServerClient = () => {
    const baseUrl = process.env.API_URL || 'http://localhost:7999';
    return informationPocClient({baseUrl});
}