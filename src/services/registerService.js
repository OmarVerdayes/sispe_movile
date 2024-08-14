import axios from "axios";

const url='https://lhgkaf7rki.execute-api.us-east-1.amazonaws.com/Prod'
const fk_rol='3C8816802EB011EFB5FD0AFFC0D2E18D';

const register = async (name,lastname,email)=>{
    try {
        const response = await axios.post('https://sn4tdbm8yi.execute-api.us-east-1.amazonaws.com/Prod/subscription',{
            name: name,
            lastname: lastname,
            email: email,
            fkRol: '3c8816802eb011efb5fd0affc0d2e18d'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const changePassword= async (email,temporary_password, new_password)=>{
    try {
        const response = await axios.put(url+'/change_password',{
            email,temporary_password,new_password
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const recoverUser=async(email)=>{
    try {
        const response = await axios.post(url+'/user/recover_password',{email});
        return response;
    } catch (error) {
        return error.response;
    }
}

const recoverPassword=async(email,confirmation_code,new_password)=>{
    try {
        if(email && confirmation_code && new_password){
            const response = await axios.post(url+'/user/recover_password',{email,confirmation_code,new_password});
            return response;
        }else{
            throw new Error('Debe ingresar todos los datos solicitados');
        }
    } catch (error) {
        return error.response;
    }
}

export {register,changePassword,recoverUser,recoverPassword};