import Dashboard from "@/components/Dashboard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavigationProvider } from "@/contexts/NavigationContext";

export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationProvider>
          <Dashboard />
        </NavigationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
