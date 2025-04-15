import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import EmployeeList from "@/pages/employee-list";
import TitleList from "@/pages/title-list";
import AddEmployee from "@/pages/add-employee";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, UserPlus, Home } from "lucide-react";

function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center group cursor-pointer">
            <Home className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-bold group-hover:text-neutral-100 transition-colors">
              Employee Management System
            </h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-flex items-center">
            <Users className="h-5 w-5 mr-1" />
            <span>Admin</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function Navigation() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Link href="/">
        <Button className="flex items-center shadow-md">
          <Users className="mr-2 h-5 w-5" />
          Employee List
        </Button>
      </Link>
      <Link href="/titles">
        <Button className="flex items-center shadow-md">
          <Briefcase className="mr-2 h-5 w-5" />
          Title List
        </Button>
      </Link>
      <Link href="/add">
        <Button variant="default" className="flex items-center shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Employee
        </Button>
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Employee Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Navigation />
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={EmployeeList} />
      <Route path="/titles" component={TitleList} />
      <Route path="/add" component={AddEmployee} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;
