import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useState, useEffect } from "react";

function InstructorDashboardPage() {

    const [activeTab, setActiveTab] = useState('dashboard');
    const {resetCredentials} = useContext(AuthContext);
    const {instructorCoursesList, setInstructorCoursesList} = useContext(InstructorContext);

    const menuItems = [
        {
            icon: BarChart,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard listOfCourses={instructorCoursesList}/>,
        },
        {
            icon: Book,
            label: 'Courses',
            value: 'courses',
            component : <InstructorCourses listOfCourses={instructorCoursesList}/>,
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null,
        },
    ];

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
    }

    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();

        console.log(response,'listresponse');
        if(response?.success){
            setInstructorCoursesList(response?.data);
        }
    }

    useEffect(()=>{
        fetchAllCourses();
    },[]);

    return (
        <div className="flex h-full min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
                    <nav>
                        {
                            menuItems.map(menuItem=>
                            <Button 
                                key={menuItem.value} 
                                className={`w-full justify-start mb-2 ${activeTab === menuItem.value ? 'bg-gray-300' : ''}`}
                                variant = {activeTab===menuItem.value? 'secondary' : 'ghost'}
                                onClick={menuItem.value === 'logout' 
                                    ? handleLogout 
                                    : () => setActiveTab(menuItem.value)}
                            >
                                <menuItem.icon/>
                                {menuItem.label}
                            </Button>)
                        }
                    </nav>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {
                        activeTab == 'dashboard' ? 
                        <h1 className="text-3xl font-bold mb-8">
                            Dashboard
                        </h1> 
                        : <></>
                    }
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {
                            menuItems.map(menuItem=> <TabsContent value={menuItem.value} key={menuItem.value}>
                                {
                                    menuItem.component !== null ? menuItem.component : null
                                }
                            </TabsContent>)
                        }
                    </Tabs>
                </div>
            </main>
        </div>

    );
}

export default InstructorDashboardPage;