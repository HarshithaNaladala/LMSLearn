import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { loginService, registerService, checkAuthService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthContext = createContext(null);

function AuthProvider({children}){
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });

    async function handleRegisterUser(event) {
        event.preventDefault();
        const data = await registerService(signUpFormData);

        console.log(data);
    }

    async function handleLoginUser(event) {
        event.preventDefault();
        const data = await loginService(signInFormData);

        if(data.success){
            sessionStorage.setItem('accessToken',data.data.accessToken);
            setAuth({
                authenticate: true,
                user: data.data.user,
            })
        }
        else{
            setAuth({
                authenticate: false,
                user: null,
            })
        }

    }

    async function checkAuthUser() {
        try{
            const data = await checkAuthService();

        if(data.success){
            setAuth({
                authenticate: true,
                user: data.data.user,
            });
            setLoading(false);
        }
        else{
            setAuth({
                authenticate: false,
                user: null,
            });
            setLoading(false);
        }
        }
        catch(error){
            console.log(error);
            if(!error?.response?.data?.success){
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null,
        })
    }

    useEffect(()=>{
        checkAuthUser();
    }, [])

    console.log(auth);

    return(
        <AuthContext.Provider 
            value={{
                    signInFormData, 
                    setSignInFormData, 
                    signUpFormData, 
                    setSignUpFormData,
                    handleRegisterUser,
                    handleLoginUser,
                    auth,
                    resetCredentials,
                    }}
                >
                    {
                        loading ? <Skeleton /> : children
                    }
                </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,  // Validate 'children' prop
};


export default AuthProvider;