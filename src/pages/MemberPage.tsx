import { useParams, Link } from "react-router-dom";
import BubbleBackground from "@/components/BubbleBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemberPage() {
  const { name } = useParams<{ name: string }>();
  const title = (name || "").replace(/^./, (c) => c.toUpperCase());

  const isIvan = title.toLowerCase() === "ivan";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
      <BubbleBackground count={6} minSize={40} maxSize={120} />
      <div className="max-w-3xl mx-auto p-6 sm:p-10 relative z-10">
        <Card className="border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-caveat text-4xl text-center">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isIvan ? (
              <div className="text-center space-y-4">
                <p className="text-gray-700">Tu pestaña personal está conectada a Cardiac Rehab.</p>
                <Link to="/plans">
                  <Button className="font-bubblegum">Ir a mis planes</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-700">Pronto verás aquí tus planes y seguimiento personal.</p>
                <p className="text-sm text-gray-600">Estamos preparando contenidos para {title}.</p>
                <Link to="/plans">
                  <Button variant="outline" className="font-bubblegum">Explorar ejemplo (Ivan)</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
