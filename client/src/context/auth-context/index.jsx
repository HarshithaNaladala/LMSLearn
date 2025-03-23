import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { loginService, registerService, checkAuthService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const AuthContext = createContext(null);

function AuthProvider({children}){
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('signin');
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        description: "",
    });

    const openDialog = (title, description) => {
        setDialog({ isOpen: true, title, description });
    };

    const closeDialog = () => {
        setDialog({ ...dialog, isOpen: false });
    };

    async function handleRegisterUser(event) {
        event.preventDefault();
        try {
            const data = await registerService(signUpFormData);
            if(data.success){
                openDialog("Registration Successful", "User Registered Successfully!");
                setSignUpFormData(initialSignUpFormData); 
                setActiveTab('signin'); 
            } else {
                openDialog("Registration Failed", data.message || "User Not Registered Successfully!");
            }
        } catch (error) {
            console.error("Registration error:", error);
            openDialog("Registration Error", error.response?.data?.message || "An unexpected error occurred during registration.");
        }
    }
    
    async function handleLoginUser(event) {
        event.preventDefault();
        try {
            const data = await loginService(signInFormData);
            if(data.success){
                sessionStorage.setItem('accessToken', data.data.accessToken);
                setAuth({
                    authenticate: true,
                    user: data.data.user,
                });
                setSignInFormData(initialSignInFormData);
                openDialog("Login Successful!");
            } else {
                openDialog("Login Failed", data.message || "Check your credentials and try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            openDialog("Login Error", error.response?.data?.message || "An unexpected error occurred during login.");
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
            value=  {{
                        signInFormData, 
                        setSignInFormData, 
                        signUpFormData, 
                        setSignUpFormData,
                        handleRegisterUser,
                        handleLoginUser,
                        auth,
                        resetCredentials,
                        activeTab,
                        setActiveTab,
                    }}
                >
                    {
                        loading ? <Skeleton /> : children
                    }
                    <AlertDialog open={dialog.isOpen} onOpenChange={closeDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
                                <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={closeDialog}>Close</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,  // Validate 'children' prop
};


export default AuthProvider;