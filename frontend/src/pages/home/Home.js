"use client";

const React = require("react");

const { AppSidebar } = require("../../components/app-sidebar");
const { Button } = require("@/components/ui/button");
const { Card } = require("@/components/ui/card");
const { Input } = require("@/components/ui/input");
const { Avatar } = require("@/components/ui/avatar");
const { ChevronLeft, ChevronRight, Search, Book, Star, Check, X, Percent, Trophy, Medal } = require("lucide-react");
const { SidebarInset, SidebarProvider } = require("@/components/ui/sidebar");

function ChallengeCard({ title, progress, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-[200px] object-cover" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <Button variant="secondary" size="sm">
              Resume
            </Button>
          </div>
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 transform -rotate-90">
              <circle className="text-muted stroke-current" strokeWidth="4" fill="none" r="20" cx="24" cy="24" />
              <circle
                className={`${progress >= 50 ? "text-green-500" : "text-red-500"} stroke-current`}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                r="20"
                cx="24"
                cy="24"
                strokeDasharray={`${progress * 1.26} 126`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <div className="text-2xl mb-1 flex justify-center">{icon}</div>
      <div className="font-bold text-xl">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function LeaderboardItem({ name, points, position }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10" />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{points} puntos</div>
      </div>
      {position === 1 && <Trophy className="h-6 w-6 text-yellow-400" />}
      {position === 2 && <Medal className="h-6 w-6 text-gray-400" />}
      {position === 3 && <Medal className="h-6 w-6 text-amber-600" />}
    </div>
  );
}

function Page() {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto_1fr] min-h-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="relative w-full">
          <div className="max-w-[1600px] mx-auto w-full xl:max-w-none">
            <div className="flex flex-col p-8 gap-8 w-full">
              {/* Header Section */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold">¡Bienvenido Lorenzo!</h1>
                  <p className="text-muted-foreground mt-1">Vamos a Aprender!</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input className="pl-10 w-[300px]" placeholder="Buscar" />
                  </div>
                  <Avatar className="h-10 w-10" />
                </div>
              </div>

              {/* Recent Challenges Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Retos recientes</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <ChallengeCard title="Two Sum" progress={75} image="/code.jpg?height=200&width=400" />
                  <ChallengeCard
                    title="Number of Islands"
                    progress={25}
                    image="/code.jpg?height=200&width=400"
                  />
                </div>
              </div>

              {/* Stats and Leaderboard Grid */}
              <div className="grid grid-cols-[2fr_1fr] gap-6">
                {/* Stats Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Último día de participación</h3>
                  <div className="flex justify-center mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">12 Aug, 2023</div>
                      <Button className="bg-[#B91C1C] hover:bg-[#991818]">Comienza ahora</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={<Book className="h-6 w-6" />} value="32" label="Retos totales" />
                    <StatCard icon={<Star className="h-6 w-6" />} value="12" label="Puntos" />
                    <StatCard icon={<Check className="h-6 w-6" />} value="12" label="Retos completados" />
                    <StatCard icon={<X className="h-6 w-6" />} value="3" label="Retos incompletos" />
                    <StatCard icon={<Percent className="h-6 w-6" />} value="93%" label="Porcentaje de aceptación" />
                  </div>
                </Card>

                {/* Leaderboard Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Leader Board</h3>
                  <div className="space-y-4">
                    <LeaderboardItem name="Daniela Caiceros" points="34" position={1} />
                    <LeaderboardItem name="Reneé Ramos" points="30" position={2} />
                    <LeaderboardItem name="Diego Sánchez" points="29" position={3} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

module.exports = Page;