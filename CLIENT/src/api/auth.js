import api from './api'

export const signUp = async (payload) => {
    try{
        const {data} = await api.post('/sign-up',payload);

        return data;
    } catch(error){
        console.error(error);
        const message =error.response?.data?.message || 'An error occurred while signing up. Please try again.'
        throw new Error(message);
    };
};


export const signIn = async (payload) => {
    try{
        const {data} = await api.post('/sign-in',payload);

        return data;
    } catch(error){
        console.error(error);
        
        const message =error.response?.data?.message || 'An error occurred while signing in. Please try again.'
        throw new Error(message);
    };
};

export const logout = async () => {
    try{
        await api.post('/sign-out');

       window.location.href = '/auth';
    } catch(error){
        console.error(error);
        
        const message =error.response?.data?.message || 'An error occurred while signing out. Please try again.'
        throw new Error(message);
    };
};


export const me = async () => {
    try{
        const {data} = await api.get('/me');

        return data;
    } catch(error){
        console.error(error);
        
        const message =error.response?.data?.message || 'An error occurred while fetching user data. Please try again.'
        throw new Error(message);
    };
};


//multiple-choice test, no open notes, might have questions that will be explaining certain code. 25 questions for 1 hour. there will be a bit of css