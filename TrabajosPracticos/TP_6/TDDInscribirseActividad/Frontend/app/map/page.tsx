"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Users, Info, TreePine, Waves, Mountain } from "lucide-react"
import Link from "next/link"

interface MapPoint {
  id: string
  name: string
  type: "activity" | "landmark" | "facility"
  x: number
  y: number
  description: string
  icon: any
  schedule?: string
  capacity?: number
}

const mapPoints: MapPoint[] = [
  {
    id: "1",
    name: "Safari",
    type: "activity",
    x: 20,
    y: 30,
    description: "Expedición para observar la vida silvestre en su hábitat natural",
    icon: Users,
    schedule: "Martes a Domingos, de  9:00 AM a 18:00 PM",
    capacity: 8,
  },
  {
    id: "2",
    name: "Palestra",
    type: "activity",
    x: 65,
    y: 25,
    description: "pared artificial para practicar y entrenar la escalada deportiva",
    icon: TreePine,
    schedule: "Sábados y Domingos, 9:00 AM",
    capacity: 12,
  },
  {
    id: "3",
    name: "Jardineria",
    type: "landmark",
    x: 35,
    y: 60,
    description: "Lago natural con área de descanso",
    icon: Waves,
    capacity: 12,

  },
  {
    id: "4",
    name: "Tirolesa",
    type: "landmark",
    x: 75,
    y: 70,
    description: "Vista panorámica de todo el parque",
    icon: Mountain,
    capacity: 10,

  },
  {
    id: "5",
    name: "Centro de Información",
    type: "facility",
    x: 50,
    y: 85,
    description: "Información turística y servicios",
    icon: Info,
  },
  {
    id: "6",
    name: "Taller de Fotografía",
    type: "activity",
    x: 80,
    y: 45,
    description: "Aprende fotografía de naturaleza",
    icon: Users,
    schedule: "Domingos, 4:00 PM",
    capacity: 15,
  },
  {
    id: "7",
    name: "Meditación en el Jardín",
    type: "activity",
    x: 25,
    y: 75,
    description: "Sesiones de meditación guiada",
    icon: Users,
    schedule: "Martes y Jueves, 6:00 PM",
    capacity: 20,
  },
]

export default function MapPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "activity":
        return "bg-primary text-primary-foreground"
      case "landmark":
        return "bg-chart-2 text-white"
      case "facility":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "activity":
        return "bg-primary/10 text-primary border-primary/20"
      case "landmark":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "facility":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      default:
        return ""
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-balance">Mapa del Parque</h1>
          <p className="text-muted-foreground text-pretty">
            Explora las actividades y puntos de interés del parque natural
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa Interactivo
                </CardTitle>
                <CardDescription>Haz clic en los puntos para ver más información</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 rounded-lg overflow-hidden border-2 border-border">
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 dark:bg-green-700 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300 dark:bg-emerald-700 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-teal-300 dark:bg-teal-700 rounded-full blur-3xl" />
                  </div>

                  {/* Map points */}
                  {mapPoints.map((point) => {
                    const Icon = point.icon
                    return (
                      <button
                        key={point.id}
                        onClick={() => setSelectedPoint(point)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getTypeColor(
                          point.type,
                        )} rounded-full p-3 shadow-lg hover:scale-110 transition-transform cursor-pointer border-2 border-white dark:border-gray-800 z-10`}
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                        }}
                        title={point.name}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    )
                  })}

                  {/* Paths connecting points (decorative) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    <path
                      d="M 20% 30% Q 35% 45% 35% 60%"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      className="text-primary"
                    />
                    <path
                      d="M 65% 25% Q 70% 35% 75% 70%"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      className="text-primary"
                    />
                    <path
                      d="M 35% 60% Q 42% 72% 50% 85%"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      className="text-primary"
                    />
                  </svg>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Actividades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-chart-2" />
                    <span className="text-muted-foreground">Puntos de interés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-chart-4" />
                    <span className="text-muted-foreground">Instalaciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedPoint ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full ${getTypeColor(selectedPoint.type)} p-2`}>
                        {<selectedPoint.icon className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedPoint.name}</CardTitle>
                        <Badge variant="outline" className={`mt-1 ${getTypeBadgeColor(selectedPoint.type)}`}>
                          {selectedPoint.type === "activity"
                            ? "Actividad"
                            : selectedPoint.type === "landmark"
                              ? "Punto de interés"
                              : "Instalación"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{selectedPoint.description}</p>

                  {selectedPoint.schedule && (
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Horario</p>
                        <p className="text-muted-foreground">{selectedPoint.schedule}</p>
                      </div>
                    </div>
                  )}

                  {selectedPoint.capacity && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Capacidad</p>
                        <p className="text-muted-foreground">{selectedPoint.capacity} personas</p>
                      </div>
                    </div>
                  )}

                  {selectedPoint.type === "activity" && (
                    <Button className="w-full" onClick={() => router.push("/enroll")}>
                      Inscribirse a esta actividad
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Información</CardTitle>
                  <CardDescription>Selecciona un punto en el mapa para ver más detalles</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    El parque cuenta con múltiples actividades y puntos de interés. Explora el mapa para descubrir todo
                    lo que tenemos para ofrecer.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actividades Destacadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mapPoints
                    .filter((p) => p.type === "activity")
                    .slice(0, 3)
                    .map((point) => (
                      <button
                        key={point.id}
                        onClick={() => setSelectedPoint(point)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full ${getTypeColor(point.type)} p-2`}>
                            <point.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{point.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{point.schedule}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
