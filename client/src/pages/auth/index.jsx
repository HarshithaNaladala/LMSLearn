import CommonForm from "@/components/common-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signUpFormControls, signInFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
    const [activeTab, setActiveTab] = useState('signin');

    const {
        signInFormData, 
        setSignInFormData, 
        signUpFormData, 
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser
    } = useContext(AuthContext);


    function handleTabChange ({value}){
        return setActiveTab(value);
    }

    function checkIfSignInFormIsValid(){
        return signInFormData && signInFormData.userEmail!=='' && signInFormData.password!='';
    }

    function checkIfSignUpFormIsValid(){
        return signUpFormData && signUpFormData.userName!='' && signUpFormData.userEmail!='' && signUpFormData.password!='';
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="w-full px-4 lg:px-6 h-14 flex items-center border-b">
                <Link to={'/'} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4"></GraduationCap>
                    <span className="font-extrabold text-xl">LMS LEARN</span>
                </Link>
            </header>
            <div className="flex items-center justify-center min-h-screen bg-background">
            <Tabs value={activeTab} defaultValue="singin" onValueChange={handleTabChange} className="w-full max-w-md">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Card className='p-6 space-y-4'>
                        <CardHeader>
                            <CardTitle>Sign In to your Account</CardTitle>
                            <CardDescription>Enter your Username and Password</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <CommonForm 
                                formControls={signInFormControls} 
                                buttonText={'Sign In'} 
                                formData={signInFormData} 
                                setFormData={setSignInFormData} 
                                isButtonDisabled={!checkIfSignInFormIsValid()}
                                handleSubmit={handleLoginUser}
                            >
                            </CommonForm>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className='p-6 space-y-4'>
                        <CardHeader>
                            <CardTitle>Create a new Account</CardTitle>
                            <CardDescription>Enter your details to get started</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <CommonForm 
                                formControls={signUpFormControls} 
                                buttonText={'Sign Up'} 
                                formData={signUpFormData} 
                                setFormData={setSignUpFormData} 
                                isButtonDisabled={!checkIfSignUpFormIsValid()}
                                handleSubmit={handleRegisterUser}
                            >
                            </CommonForm>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            </div>
        </div>
    );
}

export default AuthPage;